

const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

const getCPCDefinitions = async (patentNumber) => {
    const url = `https://patents.google.com/patent/${patentNumber}/en`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            },
        });

        const $ = cheerio.load(response.data);
        const resultArray = [];

        $('section h2:contains("Classifications")')
            .nextAll('ul')
            .find('ul[itemprop="classifications"]')
            .each((_, classificationGroup) => {
                const path = [];

                $(classificationGroup)
                    .find('> li[itemprop="classifications"]')
                    .each((__, li) => {
                        const code = $(li).find('span[itemprop="Code"]').text().trim();
                        const desc = $(li).find('span[itemprop="Description"]').text().trim();
                        if (code && desc) {
                            path.push({ [code]: desc });
                        }

                        const isLeaf = $(li).find('meta[itemprop="Leaf"]').length > 0;
                        if (isLeaf && code) {
                            resultArray.push({
                                leafCode: code,
                                hierarchy: [...path]
                            });
                        }
                    });
            });

        return resultArray;
    } catch (error) {
        console.error('Error fetching or parsing:', error.message);
        return { error: error.message };
    }
};


router.get('/:patentNumber', async (req, res) => {
    const { patentNumber } = req.params;

    if (!patentNumber) {
        return res.status(400).json({ error: 'Patent number is required' });
    }

    try {
        const result = await getCPCDefinitions(patentNumber);
        res.status(200).json(result);
    } catch (error) {
        console.error('🔴 Error fetching CPC definitions:', error.message);
        res.status(500).json({ error: 'Failed to fetch CPC definitions' });
    }
});

module.exports = router;














// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const axiosRetry = require('axios-retry');
// const cheerio = require('cheerio');
// const https = require('https');

// // Setup HTTP Keep-Alive agent
// const httpsAgent = new https.Agent({ keepAlive: true });

// // Retry failed requests automatically
// axiosRetry(axios, {
//     retries: 3,
//     retryDelay: axiosRetry.exponentialDelay,
//     retryCondition: (error) =>
//         axiosRetry.isNetworkError(error) ||
//         axiosRetry.isRetryableError(error) ||
//         error.response?.status === 429, // too many requests
// });

// // Basic in-memory cache (simple TTL logic can be added)
// const cache = new Map();

// const getCPCDefinitions = async (patentNumber) => {
//     if (cache.has(patentNumber)) {
//         return cache.get(patentNumber);
//     }

//     const url = `https://patents.google.com/patent/${patentNumber}/en`;

//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0',
//             },
//             timeout: 10000,
//             httpsAgent,
//         });

//         const $ = cheerio.load(response.data);
//         const resultArray = [];

//         const classificationSections = $('section h2:contains("Classifications")')
//             .nextAll('ul')
//             .find('ul[itemprop="classifications"]');

//         if (classificationSections.length === 0) {
//             return []; // No classification section found
//         }

//         classificationSections.each((_, group) => {
//             const path = [];
//             const listItems = $(group).children('li[itemprop="classifications"]');

//             listItems.each((__, li) => {
//                 const $li = $(li);
//                 const code = $li.find('span[itemprop="Code"]').text().trim();
//                 const desc = $li.find('span[itemprop="Description"]').text().trim();

//                 if (code && desc) {
//                     path.push({ [code]: desc });
//                 }

//                 const isLeaf = $li.find('meta[itemprop="Leaf"]').length > 0;
//                 if (isLeaf && code) {
//                     resultArray.push({
//                         leafCode: code,
//                         hierarchy: [...path],
//                     });
//                 }
//             });
//         });

//         cache.set(patentNumber, resultArray); // Save to cache
//         return resultArray;
//     } catch (error) {
//         console.error('❌ Error fetching/parsing:', error.message);
//         return { error: error.message };
//     }
// };

// // GET route
// router.get('/:patentNumber', async (req, res) => {
//     const { patentNumber } = req.params;

//     // Validate input format (basic)
//     if (!patentNumber || !/^[A-Z]{2}[0-9A-Z]+$/i.test(patentNumber)) {
//         return res.status(400).json({ error: 'Invalid or missing patent number' });
//     }

//     try {
//         const result = await getCPCDefinitions(patentNumber);

//         if (result.error) {
//             return res.status(500).json({ error: result.error });
//         }

//         res.status(200).json(result);
//     } catch (error) {
//         console.error('🔴 Server error:', error.message);
//         res.status(500).json({ error: 'Failed to fetch CPC definitions' });
//     }
// });

// module.exports = router;































// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const cheerio = require('cheerio');


// const getCPCDefinitions = async (patentNumber) => {
//   const url = `https://patents.google.com/patent/${patentNumber}/en`;

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         'User-Agent': 'Mozilla/5.0',
//       },
//     });

//     const $ = cheerio.load(response.data);

//     const result = {};
//     const seenPaths = new Set();

//     $('section h2:contains("Classifications")')
//       .nextAll('ul')
//       .each((i, ul) => {
//         const stack = [];
//         $(ul)
//           .find('li[itemprop="classifications"]')
//           .each((j, li) => {
//             const code = $(li).find('span[itemprop="Code"]').text().trim();
//             const desc = $(li).find('span[itemprop="Description"]').text().trim();

//             if (!code || !desc) return;

//             stack.push({ [code]: desc });

//             if ($(li).find('meta[itemprop="Leaf"]').length > 0) {
//               const fullCode = code;
//               if (!seenPaths.has(fullCode)) {
//                 result[fullCode] = [...stack];
//                 seenPaths.add(fullCode);
//               }
//               stack.pop();
//             }
//           });
//       });

//     return result;
//   } catch (error) {
//     console.error('Error fetching or parsing:', error.message);
//   }
// };





// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: 'Patent number is required' });
//   }

//   try {
//     const result = await getCPCDefinitions(patentNumber);
//     res.status(200).json(result);
//   } catch (error) {
//     console.error('🔴 Error fetching CPC definitions:', error.message);
//     res.status(500).json({ error: 'Failed to fetch CPC definitions' });
//   }
// })

// module.exports = router;