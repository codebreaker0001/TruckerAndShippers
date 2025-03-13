// controllers/loadController.js
import Load from '../models/load.js';

export const createLoad = async (req, res) => {
  try {
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
    const { route, startDate, endDate } = req.query;
    const query = { status: 'open' };

    // Route filter (if provided)
    if (route) {
      query.route = { $regex: route, $options: 'i' };
    }

    // Date filtering with validation
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate && !isNaN(new Date(startDate).getTime())) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate && !isNaN(new Date(endDate).getTime())) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Debug: Log the query
    console.log('Query:', query);

    const loads = await Load.find(query);
    res.json(loads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch loads.', error: error.message });
  }
};

