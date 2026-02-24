#!/usr/bin/env python3
"""
Auto Resume Tailor — from Job Description
==========================================
Reads your base resume + a job description → generates a tailored DOCX.

Usage:
    python tailor_from_jd.py                    # interactive mode
    python tailor_from_jd.py --client varun     # skip client selection
    python tailor_from_jd.py --jd path/to/jd.txt --client varun  # fully automated
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path

# ── Bootstrap path so shared/ imports work ─────────────────────────────────
current_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(current_dir))


# ── Load .env (no dotenv required) ─────────────────────────────────────────
def _load_env():
    for parent in Path(__file__).resolve().parents:
        env_file = parent / ".env"
        if env_file.exists():
            with open(env_file) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, _, v = line.partition("=")
                        os.environ.setdefault(k.strip(), v.strip())
            return

_load_env()


# ── Helpers ─────────────────────────────────────────────────────────────────

def load_profiles() -> list:
    """Load client profiles from client_data/profiles.json."""
    path = current_dir / "client_data" / "profiles.json"
    if not path.exists():
        return []
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def select_client(profiles: list, client_id: str = None) -> dict:
    """Select a client profile interactively or by ID."""
    if client_id:
        for p in profiles:
            if p["id"] == client_id:
                return p
        print(f"[!] Client '{client_id}' not found in profiles.json")
        sys.exit(1)

    if not profiles:
        # No profiles — ask for paths directly
        resume_path = input("\nNo profiles.json found. Enter base resume path (.docx): ").strip()
        name = input("Your name: ").strip() or "Candidate"
        return {
            "id": "custom",
            "name": name,
            "base_resume_path": resume_path,
            "output_dir": "client_data/outputs/custom",
            "summary": "",
        }

    print("\nSelect candidate:")
    for i, p in enumerate(profiles, 1):
        print(f"  {i}. {p['name']}  (id: {p['id']})")
    print("  0. Enter custom resume path")

    while True:
        try:
            choice = int(input("\nEnter number: ").strip())
        except ValueError:
            continue

        if choice == 0:
            resume_path = input("Base resume path (.docx): ").strip()
            name = input("Your name: ").strip() or "Candidate"
            return {
                "id": "custom",
                "name": name,
                "base_resume_path": resume_path,
                "output_dir": "client_data/outputs/custom",
                "summary": "",
            }
        if 1 <= choice <= len(profiles):
            return profiles[choice - 1]


def read_jd_interactive() -> str:
    """Get job description by paste or file path."""
    print("\nJob Description source:")
    print("  1. Paste text  (press Enter twice when done)")
    print("  2. Load from file")

    while True:
        try:
            mode = int(input("Choose (1/2): ").strip())
        except ValueError:
            continue

        if mode == 2:
            file_path = input("Path to JD text file: ").strip()
            try:
                with open(file_path, encoding="utf-8") as f:
                    return f.read().strip()
            except Exception as e:
                print(f"  [!] Cannot read file: {e}")
                continue

        # Paste mode
        print("\nPaste the job description below.")
        print("(Press Enter twice when done)\n")
        lines = []
        blank_streak = 0
        while blank_streak < 2:
            line = input()
            if line == "":
                blank_streak += 1
            else:
                blank_streak = 0
            lines.append(line)
        return "\n".join(lines).strip()


def resolve_resume_path(client: dict) -> str:
    """Return absolute path to the base resume, exiting if not found."""
    raw = client.get("base_resume_path", "")
    if not raw:
        print(f"[!] No base_resume_path set for client '{client['id']}'")
        sys.exit(1)

    # Try as-is first
    if os.path.isabs(raw) and os.path.exists(raw):
        return raw

    # Relative to the job_automation_core folder
    candidate = current_dir / raw
    if candidate.exists():
        return str(candidate)

    print(f"[!] Base resume not found: {raw}")
    print(f"    Tried: {candidate}")
    sys.exit(1)


def calculate_ats_score(resume_path: str, job: dict) -> int:
    """Calculate ATS match score. Returns 0 on error."""
    try:
        from docx import Document
        from shared.ats_scorer import ATSScorer
        doc = Document(resume_path)
        resume_text = "\n".join(p.text for p in doc.paragraphs)
        scorer = ATSScorer(config_path=str(current_dir / "config" / "config.json"))
        result = scorer.calculate_ats_score(resume_text, job)
        return result.get("overall_score", 0)
    except Exception:
        return 0


# ── Main ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Tailor a base resume to a job description using Claude AI"
    )
    parser.add_argument("--client", help="Client ID from profiles.json (e.g. varun, abdul)")
    parser.add_argument("--jd", help="Path to a .txt file containing the job description")
    parser.add_argument(
        "--no-bullets",
        action="store_true",
        help="Skip auto-applying bullet enhancements (show suggestions only)",
    )
    args = parser.parse_args()

    print("\n" + "=" * 60)
    print("  AUTO RESUME TAILOR")
    print("  Base Resume + Job Description → Tailored DOCX")
    print("=" * 60)

    # 1. Load profiles & select client
    profiles = load_profiles()
    client = select_client(profiles, args.client)
    base_resume = resolve_resume_path(client)
    print(f"\nCandidate : {client['name']}")
    print(f"Resume    : {base_resume}")

    # 2. Get job description
    if args.jd:
        jd_path = Path(args.jd)
        if not jd_path.exists():
            print(f"[!] JD file not found: {args.jd}")
            sys.exit(1)
        jd = jd_path.read_text(encoding="utf-8").strip()
        print(f"JD file   : {args.jd}")
    else:
        jd = read_jd_interactive()

    if not jd:
        print("[!] Job description is empty. Exiting.")
        sys.exit(1)

    # 3. Job title & company (for filename and Claude context)
    print("\nJob details (used for filename and cover letter context):")
    title   = input("  Job Title  : ").strip() or "Position"
    company = input("  Company    : ").strip() or "Company"

    job = {
        "title":       title,
        "company":     company,
        "description": jd,
    }

    # 4. Output path
    company_safe = company.replace(" ", "_").replace("/", "_")[:30]
    ts = int(time.time())
    output_dir = current_dir / client.get("output_dir", f"client_data/outputs/{client['id']}")
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = str(output_dir / f"Resume_{company_safe}_{ts}.docx")

    # 5. Run tailoring pipeline
    print(f"\n{'='*60}")
    print(f"  Tailoring: {title} at {company}")
    print(f"{'='*60}")

    from shared.tailoring_pipeline import ThreeLayerTailoringPipeline

    # Optional: ATS baseline
    print("\nCalculating baseline ATS score...")
    before_score = calculate_ats_score(base_resume, job)

    try:
        pipeline = ThreeLayerTailoringPipeline(base_resume)
        result = pipeline.tailor_resume(
            job=job,
            output_path=output_path,
            apply_bullet_suggestions=not args.no_bullets,
        )
    except Exception as e:
        print(f"\n[!] Tailoring failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

    # Optional: ATS after
    print("\nCalculating tailored ATS score...")
    after_score = calculate_ats_score(output_path, job)

    # 6. Report
    print(f"\n{'='*60}")
    print("  DONE")
    print(f"{'='*60}")
    print(f"\nOutput    : {output_path}")

    if before_score or after_score:
        improvement = after_score - before_score
        sign = "+" if improvement >= 0 else ""
        print(f"\nATS Score : {before_score}/100  →  {after_score}/100  ({sign}{improvement})")

    print(f"\nModifications:")
    print(f"  Keywords injected : {result['keywords_injected']}")
    print(f"  Summary rewritten : {'Yes' if result['summary_rewritten'] else 'No'}")
    print(f"  Bullets enhanced  : {result['bullets_applied']}")
    print(f"  Total changes     : {result['total_modifications']}")

    if not args.no_bullets and result['bullet_suggestions'] > result['bullets_applied']:
        remaining = result['bullet_suggestions'] - result['bullets_applied']
        print(f"\n  ({remaining} bullet suggestion(s) could not be auto-matched — review manually)")

    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCancelled.")
        sys.exit(0)
