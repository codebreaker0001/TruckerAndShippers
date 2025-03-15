// controllers/bidController.js
import Bid from '../models/Bid.js';
import Load from '../models/load.js';
import User from '../models/user.js';

export const placeBid = async (req, res) => {
  try {
    if (req.user.role !== 'trucker') {
      return res.status(403).json({ message: 'Only truckers can place bids.' });
    }

    // Retrieve trucker details
    const trucker = await User.findById(req.user.id);
    if (!trucker) {
      return res.status(400).json({ message: 'Trucker not found.' });
    }

    // Check eligibility criteria before allowing bid
    const licenseYears = (new Date().getFullYear()) - (new Date(trucker.licenseIssueDate).getFullYear());
    if (trucker.accidents > 0 || trucker.theftComplaints > 0 || trucker.truckAge > 5 || licenseYears < 5) {
      return res.status(403).json({ message: 'You do not meet the eligibility criteria to place bids.' });
    }

    // Proceed with bid placement
    const { loadId, bidAmount } = req.body;
    const newBid = new Bid({ loadId, truckerId: req.user.id, bidAmount });
    await newBid.save();
    res.status(201).json({ message: 'Bid placed successfully.', bid: newBid });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place bid.', error: error.message });
  }
};


export const getBidsForLoad = async (req, res) => {
  try {
    const { loadId } = req.params;
    // Sort bids so that the lowest bid comes first
    const bids = await Bid.find({ loadId }).sort({ bidAmount: 1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve bids.', error: error.message });
  }
};

// Optional: Endpoint to select the winning bid (lowest bid wins)
export const selectWinningBid = async (req, res) => {
  try {
    const { loadId } = req.params;
    // Find the bid with the lowest bidAmount for this load
    const bid = await Bid.findOne({ loadId }).sort({ bidAmount: 1 });
    if (!bid) {
      return res.status(404).json({ message: 'No bids found for this load.' });
    }

    // Update the load status to "in-progress" (or "completed", based on your logic)
    await Load.findByIdAndUpdate(loadId, { status: 'in-progress', winningBid: bid._id });
    res.json({ message: 'Winning bid selected.', winningBid: bid });
  } catch (error) {
    res.status(500).json({ message: 'Failed to select winning bid.', error: error.message });
  }
};
