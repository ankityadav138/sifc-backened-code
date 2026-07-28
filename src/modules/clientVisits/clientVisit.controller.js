const ClientVisit = require("./clientVisit.model");
const cloudinary = require("../../config/cloudinary");

const createClientVisit = async (req, res) => {
  try {
    const {
      clientName,
      phone,
      email,
      managerId,
      telecallerId,
      latitude,
      longitude,
      documents,
      comment
    } = req.body;

    if (!clientName || !phone || !managerId || !telecallerId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (clientName, phone, managerId, telecallerId, latitude, longitude are required)"
      });
    }

    const visit = await ClientVisit.create({
      salesExecutiveId: req.user.id,
      clientName,
      phone,
      email,
      managerId,
      telecallerId,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      documents: documents || [],
      comment: comment || ''
    });

    const populatedVisit = await ClientVisit.findById(visit._id)
      .populate("salesExecutiveId", "name phone email")
      .populate("managerId", "name phone")
      .populate("telecallerId", "name phone");

    res.status(201).json({
      success: true,
      message: "Client visit and documents logged successfully",
      data: populatedVisit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getClientVisits = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "SALES_EXECUTIVE") {
      filter.salesExecutiveId = req.user.id;
    }

    const visits = await ClientVisit.find(filter)
      .populate("salesExecutiveId", "name phone email")
      .populate("managerId", "name phone")
      .populate("telecallerId", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visits.length,
      data: visits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateClientVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      clientName,
      phone,
      email,
      managerId,
      telecallerId,
      latitude,
      longitude,
      documents,
      comment
    } = req.body;

    const visit = await ClientVisit.findById(id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Client visit not found"
      });
    }

    // Restrict sales executives to only update their own entries
    if (req.user.role === "SALES_EXECUTIVE" && visit.salesExecutiveId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only update your own client visits"
      });
    }

    if (clientName) visit.clientName = clientName;
    if (phone) visit.phone = phone;
    if (email !== undefined) visit.email = email;
    if (managerId) visit.managerId = managerId;
    if (telecallerId) visit.telecallerId = telecallerId;
    
    if (latitude !== undefined && longitude !== undefined) {
      visit.location = {
        latitude: Number(latitude),
        longitude: Number(longitude)
      };
    }

    if (documents) {
      visit.documents = documents;
    }
    if (comment !== undefined) {
      visit.comment = comment;
    }

    await visit.save();

    const populatedVisit = await ClientVisit.findById(visit._id)
      .populate("salesExecutiveId", "name phone email")
      .populate("managerId", "name phone")
      .populate("telecallerId", "name phone");

    res.status(200).json({
      success: true,
      message: "Client visit updated successfully",
      data: populatedVisit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const uploadDocumentImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "client_documents"
      }
    );

    res.status(200).json({
      success: true,
      url: result.secure_url
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createClientVisit,
  getClientVisits,
  updateClientVisit,
  uploadDocumentImage
};
