const Constraint = require("../models/Constraint");

exports.getConstraints = async (req, res) => {
  const data = await Constraint.findOne();
  res.json(data);
};

exports.updateConstraints = async (req, res) => {
  const data = await Constraint.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  res.json(data);
};
