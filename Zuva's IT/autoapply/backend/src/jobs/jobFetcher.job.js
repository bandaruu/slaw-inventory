const cron = require('node-cron');
const axios = require('axios');
const Job = require('../models/Job');

async function fetchRemotiveJobs() {
  try {
    const res = await axios.get('https://remotive.com/api/remote-jobs', {
      params: { limit: 50 },
      timeout: 10000,
    });

    const jobs = res.data?.jobs || [];
    let inserted = 0;

    for (const job of jobs) {
      try {
        const postedAt = new Date(job.publication_date);
        const exists = await Job.findOne({ url: job.url });
        if (exists) continue;

        await Job.create({
          title: job.title,
          company: job.company_name,
          location: job.candidate_required_location || 'Remote',
          description: job.description?.replace(/<[^>]*>/g, '').slice(0, 5000) || '',
          url: job.url,
          source: 'Remotive',
          tags: job.tags || [],
          salary: job.salary || '',
          postedAt,
        });
        inserted++;
      } catch (e) {
        // Skip individual job errors
      }
    }
    console.log(`[JobFetcher] Remotive: inserted ${inserted} new jobs`);
  } catch (err) {
    console.error('[JobFetcher] Remotive error:', err.message);
  }
}

async function fetchAdzunaJobs() {
  try {
    if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_API_KEY) {
      return console.log('[JobFetcher] Adzuna: skipping (no API key)');
    }
    const res = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/in/search/1`,
      {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_API_KEY,
          results_per_page: 20,
          what: 'software engineer',
          content_type: 'application/json',
        },
        timeout: 10000,
      }
    );

    const jobs = res.data?.results || [];
    let inserted = 0;
    for (const job of jobs) {
      try {
        const exists = await Job.findOne({ url: job.redirect_url });
        if (exists) continue;
        await Job.create({
          title: job.title,
          company: job.company?.display_name || 'Unknown',
          location: job.location?.display_name || 'India',
          description: (job.description || '').slice(0, 5000),
          url: job.redirect_url,
          source: 'Adzuna',
          salary: job.salary_max ? `₹${job.salary_max.toLocaleString()}` : '',
          postedAt: new Date(job.created),
        });
        inserted++;
      } catch (e) {}
    }
    console.log(`[JobFetcher] Adzuna: inserted ${inserted} new jobs`);
  } catch (err) {
    console.error('[JobFetcher] Adzuna error:', err.message);
  }
}

async function runFetcher() {
  console.log('[JobFetcher] Starting job fetch cycle...');
  await Promise.allSettled([fetchRemotiveJobs(), fetchAdzunaJobs()]);
  console.log('[JobFetcher] Fetch cycle complete');
}

// Run immediately on startup
runFetcher();

// Run every hour
cron.schedule('0 * * * *', () => {
  console.log('[JobFetcher] Hourly cron triggered');
  runFetcher();
});

module.exports = { runFetcher };
