// controllers/benefitsController.js
import Claim from '../models/Claim.js';

// Returns a list of benefits available for truckers
export const getTruckBenefits = (req, res) => {
  // Static benefits list – in a real-world scenario, these might be retrieved from a database or third-party API.
  const benefits = [
    { benefitType: 'Insurance', description: 'Cheapest insurance options available for truckers.' },
    { benefitType: 'Tires', description: 'Discounts on tires from selected brands.' },
    { benefitType: 'Spare Parts', description: 'Special discounts on spare parts.' },
    { benefitType: 'Service', description: 'Reduced rates on truck servicing and maintenance.' },
    { benefitType: 'Lodging', description: 'Discounts on lodging options along major routes.' },
    { benefitType: 'Food', description: 'Exclusive food discounts at partner restaurants.' },
    { benefitType: 'Fuel', description: 'Special fuel discount programs.' },
    { benefitType: 'On-Route Claim', description: 'Claim system for on-route benefits if unexpected issues occur.' },
  ];
  res.json(benefits);
};

// Allows a trucker to submit a claim for a benefit
export const claimBenefit = async (req, res) => {
  try {
    // Ensure only truckers can claim benefits
    if (req.user.role !== 'trucker') {
      return res.status(403).json({ message: 'Only truckers can claim benefits.' });
    }

    const { benefitType, description } = req.body;

    if (!benefitType) {
      return res.status(400).json({ message: 'Benefit type is required.' });
    }

    const claim = new Claim({
      truckerId: req.user.id,
      benefitType,
      description,
    });

    await claim.save();
    res.status(201).json({ message: 'Benefit claim submitted successfully.', claim });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit claim.', error: error.message });
  }
};
