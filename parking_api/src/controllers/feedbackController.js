import Feedback from "../models/Feedback.js";

export const createFeedback = async (req, res) => {
  const user = req.user.userId;
  const spot = req.params.id;

  try {
    const existingFeedback = await Feedback.findOne({ user, spot });
    if (existingFeedback) {
      return res
        .status(400)
        .json({ message: "User has already given feedback for this spot" });
    }

    const newFeedback = new Feedback({
      rating: parseInt(req.body.rating),
      message: req.body.message,
      user,
      spot,
    });
    await newFeedback.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error creating feedback" });
  }
};

export const getFeedbacksBySpot = async (req, res) => {
  const spot = req.params.id;

  try {
    const feedbacks = await Feedback.find({ spot }).populate(
      "user",
      "_id name"
    );
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedbacks for spot" });
  }
};

export const getFeedbacksByUser = async (req, res) => {
  const user = req.params.user;

  try {
    const feedbacks = await Feedback.find({ user }).populate(
      "user",
      "_id name"
    );

    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedbacks for user" });
  }
};

export const updateFeedback = async (req, res) => {
  const feedbackId = req.params.feedbackId;

  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { rating: parseInt(req.body.rating), message: req.body.message },
      { new: true }
    );
    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ feedback: updatedFeedback });
  } catch (error) {
    res.status(500).json({ message: "Error updating feedback" });
  }
};

export const deleteFeedback = async (req, res) => {
  const feedbackId = req.params.feedbackId;

  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feedback" });
  }
};
