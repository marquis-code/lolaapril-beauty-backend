require('dotenv').config();
const axios = require('axios');

async function getPaystackBanks() {
  try {
    console.log('\n=== FETCHING PAYSTACK SUPPORTED BANKS ===\n');
    
    const response = await axios.get('https://api.paystack.co/bank', {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });
    
    const banks = response.data.data;
    
    console.log(`Found ${banks.length} banks supported by Paystack\n`);
    console.log('POPULAR BANKS:\n');
    
    const popularBanks = [
      'Access Bank',
      'GTBank',
      'Guaranty Trust Bank',
      'First Bank',
      'Zenith Bank',
      'UBA',
      'United Bank For Africa',
      'Fidelity Bank',
      'Union Bank',
      'Sterling Bank',
      'Wema Bank',
      'Polaris Bank',
      'Stanbic IBTC Bank'
    ];
    
    banks.forEach(bank => {
      const isPopular = popularBanks.some(p => bank.name.toLowerCase().includes(p.toLowerCase()));
      if (isPopular) {
        console.log(`  ${bank.name.padEnd(40)} Code: ${bank.code}`);
      }
    });
    
    console.log('\n\nALL BANKS (sorted alphabetically):\n');
    banks
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((bank, index) => {
        console.log(`${String(index + 1).padStart(3)}. ${bank.name.padEnd(50)} Code: ${bank.code}`);
      });
    
    console.log('\n\n💡 TIP: Use these codes when setting up business bank accounts');
    console.log('   Example: For GT Bank, use code "058"\n');
    
  } catch (error) {
    console.error('Error fetching banks:', error.response?.data || error.message);
  }
}

getPaystackBanks();
