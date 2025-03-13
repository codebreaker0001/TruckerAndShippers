// controllers/bidController.js
import Bid from '../models/Bid.js';
import Load from '../models/load.js';

export const placeBid = async (req, res) => {
  try {
    // Only truckers can place bids
    if (req.user.role !== 'trucker') {
      return res.status(403).json({ message: 'Only truckers can place bids.' });
    }

    const { loadId, bidAmount } = req.body;

    // Verify that the load exists
    const load = await Load.findById(loadId);
    if (!load) {
      return res.status(404).json({ message: 'Load not found.' });
    }

    // Ensure the load is still open for bidding
    if (load.status !== 'open') {
      return res.status(400).json({ message: 'Bidding is closed for this load.' });
    }

    // Create and save the bid
    const bid = new Bid({
      loadId,
      truckerId: req.user.id,
      bidAmount,
    });
    await bid.save();

    res.status(201).json({ message: 'Bid placed successfully.', bid });
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
