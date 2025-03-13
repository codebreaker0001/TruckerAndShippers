// controllers/loadController.js
import Load from '../models/load.js';

export const createLoad = async (req, res) => {
  try {
    // Ensure only shippers can post loads
    if (req.user.role !== 'shipper') {
      return res.status(403).json({ message: 'Only shippers can post loads.' });
    }

    const { details, route } = req.body;
    const newLoad = new Load({
      shipperId: req.user.id,
      details,
      route,
    });

    await newLoad.save();
    res.status(201).json({ message: 'Load created successfully.', load: newLoad });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create load.', error: error.message });
  }
};

export const getLoads = async (req, res) => {
  try {
    let filters = {};

    // Apply filters if query parameters exist
    if (req.query.route) {
      filters.route = { $regex: req.query.route, $options: 'i' }; // Case-insensitive search
    }
    if (req.query.startDate) {
      filters.createdAt = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      filters.createdAt = { ...filters.createdAt, $lte: new Date(req.query.endDate) };
    }

    const loads = await Load.find(filters).sort({ createdAt: -1 });
    res.json(loads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch loads.', error: error.message });
  }
};
