const bcrypt = require("bcryptjs");

const User = require("./user.model");

const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      managerId
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      managerId
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;

    let filter = {};

    // Role filter
    if (role) {
      filter.role = role;
    }

    // Search filter
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          phone: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    // Manager sees only assigned telecallers
    if (req.user.role === "MANAGER") {
      filter.managerId = req.user.id;
    }

    const users = await User.find(filter)
      .select("-password")
      .populate("managerId", "name phone");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("managerId", "name phone");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    // Never update password here
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "User status updated",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getTelecallersByManager = async (req, res) => {
  try {
    const { managerId } = req.params;

    // Managers can only fetch their own telecallers
    if (
      req.user.role === "MANAGER" &&
      req.user.id !== managerId
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: cannot access other manager's telecallers"
      });
    }

    const telecallers = await User.find({
      role: "TELECALLER",
      managerId
    })
      .select("-password")
      .populate("managerId", "name phone");

    res.status(200).json({
      success: true,
      count: telecallers.length,
      data: telecallers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const assignManager = async (
  req,
  res,
) => {
  try {
    const {
      telecallerId,
      managerId,
    } = req.body;

    const User = require(
      './user.model',
    );

    // Check telecaller exists
    const telecaller =
      await User.findById(
        telecallerId,
      );

    if (!telecaller) {
      return res.status(404).json({
        success: false,

        message:
          'Telecaller not found',
      });
    }

    // Check manager exists
    const manager =
      await User.findById(
        managerId,
      );

    if (!manager) {
      return res.status(404).json({
        success: false,

        message:
          'Manager not found',
      });
    }

    // Validate roles
    if (
      manager.role !==
      'MANAGER'
    ) {
      return res.status(400).json({
        success: false,

        message:
          'Selected user is not a manager',
      });
    }

    if (
      telecaller.role !==
      'TELECALLER'
    ) {
      return res.status(400).json({
        success: false,

        message:
          'Selected user is not a telecaller',
      });
    }

    // Assign manager
    telecaller.managerId =
      managerId;

    await telecaller.save();

    res.status(200).json({
      success: true,

      message:
        'Manager assigned successfully',

      data: telecaller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  getTelecallersByManager,
  assignManager,
};