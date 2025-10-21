import { isRequireTeacher } from "@/lib/auth";
import connectDB from "@/lib/db";
import TeacherPaymentInfo, {
  IPaymentMethod,
} from "@/models/TeacherPaymentInfo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { teacherId, isTeacher } = isRequireTeacher(req);

    if (!isTeacher) {
      return NextResponse.json(
        { error: "You are not authorized to access this resource" },
        { status: 403 }
      );
    }

    if (!teacherId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get payment information
    const paymentInfo = await TeacherPaymentInfo.findOne({
      teacherId,
      isActive: true,
    });

    if (!paymentInfo) {
      return NextResponse.json({
        paymentMethods: [],
      });
    }

    return NextResponse.json({
      paymentMethods: paymentInfo.paymentMethods || [],
    });
  } catch (error) {
    console.error("Error fetching payment info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add new payment method
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { teacherId, isTeacher } = isRequireTeacher(req);

    if (!isTeacher) {
      return NextResponse.json(
        { error: "You are not authorized to access this resource" },
        { status: 403 }
      );
    }

    if (!teacherId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bankAccount, bankName, accountHolderName, paymentMethod } = body;

    // Validate input
    if (!bankAccount || bankAccount.trim().length === 0) {
      return NextResponse.json(
        { error: "Bank account is required" },
        { status: 400 }
      );
    }

    if (!bankName || bankName.trim().length === 0) {
      return NextResponse.json(
        { error: "Bank name is required" },
        { status: 400 }
      );
    }

    if (!accountHolderName || accountHolderName.trim().length === 0) {
      return NextResponse.json(
        { error: "Account holder name is required" },
        { status: 400 }
      );
    }

    if (!paymentMethod || paymentMethod.trim().length === 0) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    // check duplicate bank account and bank name
    const duplicateBankAccountAndBankName = await TeacherPaymentInfo.findOne({
      teacherId,
      bankAccount: bankAccount.trim(),
      bankName: bankName.trim(),
    });

    if (duplicateBankAccountAndBankName) {
      return NextResponse.json(
        { error: "Bank account and bank name already exists" },
        { status: 400 }
      );
    }

    // Find or create payment info document
    let paymentInfo = await TeacherPaymentInfo.findOne({
      teacherId,
      isActive: true,
    });

    if (!paymentInfo) {
      paymentInfo = await TeacherPaymentInfo.create({
        teacherId,
        paymentMethods: [],
        isActive: true,
      });
    }

    // Check if already has 3 payment methods
    if (paymentInfo.paymentMethods.length >= 3) {
      return NextResponse.json(
        { error: "Maximum 3 payment methods allowed" },
        { status: 400 }
      );
    }

    // Add new payment method
    const newPaymentMethod = {
      bankAccount: bankAccount.trim(),
      bankName: bankName.trim(),
      accountHolderName: accountHolderName.trim(),
      paymentMethod: paymentMethod.trim(),
      isPrimary: paymentInfo.paymentMethods.length === 0, // First one is primary
    };

    paymentInfo.paymentMethods.push(newPaymentMethod);
    await paymentInfo.save();

    return NextResponse.json({
      message: "Payment method added successfully",
      paymentMethod: newPaymentMethod,
    });
  } catch (error) {
    console.error("Error adding payment method:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update existing payment method
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const { teacherId, isTeacher } = isRequireTeacher(req);

    if (!isTeacher) {
      return NextResponse.json(
        { error: "You are not authorized to access this resource" },
        { status: 403 }
      );
    }

    if (!teacherId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      paymentMethodId,
      bankAccount,
      bankName,
      accountHolderName,
      paymentMethod,
    } = body;

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 }
      );
    }

    const paymentInfo = await TeacherPaymentInfo.findOne({
      teacherId,
      isActive: true,
    });

    if (!paymentInfo) {
      return NextResponse.json(
        { error: "Payment information not found" },
        { status: 404 }
      );
    }

    const methodIndex = paymentInfo.paymentMethods.findIndex(
      (m: IPaymentMethod) => m._id?.toString() === paymentMethodId
    );

    if (methodIndex === -1) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 }
      );
    }

    // Update payment method
    if (bankName)
      paymentInfo.paymentMethods[methodIndex].bankName = bankName.trim();
    if (accountHolderName)
      paymentInfo.paymentMethods[methodIndex].accountHolderName =
        accountHolderName.trim();
    if (bankAccount)
      paymentInfo.paymentMethods[methodIndex].bankAccount = bankAccount.trim();
    if (paymentMethod)
      paymentInfo.paymentMethods[methodIndex].paymentMethod =
        paymentMethod.trim();

    await paymentInfo.save();

    return NextResponse.json({
      message: "Payment method updated successfully",
      paymentMethod: paymentInfo.paymentMethods[methodIndex],
    });
  } catch (error) {
    console.error("Error updating payment method:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Set primary payment method
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { teacherId, isTeacher } = isRequireTeacher(req);

    if (!isTeacher) {
      return NextResponse.json(
        { error: "You are not authorized to access this resource" },
        { status: 403 }
      );
    }

    if (!teacherId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { paymentMethodId } = body;

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 }
      );
    }

    const paymentInfo = await TeacherPaymentInfo.findOne({
      teacherId,
      isActive: true,
    });

    if (!paymentInfo) {
      return NextResponse.json(
        { error: "Payment information not found" },
        { status: 404 }
      );
    }

    // Set all to false first
    paymentInfo.paymentMethods.forEach((method: IPaymentMethod) => {
      method.isPrimary = false;
    });

    // Set selected one to primary
    const methodIndex = paymentInfo.paymentMethods.findIndex(
      (m: IPaymentMethod) => m._id?.toString() === paymentMethodId
    );

    if (methodIndex === -1) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 }
      );
    }

    paymentInfo.paymentMethods[methodIndex].isPrimary = true;
    await paymentInfo.save();

    return NextResponse.json({
      message: "Primary payment method updated successfully",
    });
  } catch (error) {
    console.error("Error setting primary payment method:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove payment method
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { teacherId, isTeacher } = isRequireTeacher(req);

    if (!isTeacher) {
      return NextResponse.json(
        { error: "You are not authorized to access this resource" },
        { status: 403 }
      );
    }

    if (!teacherId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const paymentMethodId = searchParams.get("id");

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 }
      );
    }

    const paymentInfo = await TeacherPaymentInfo.findOne({
      teacherId,
      isActive: true,
    });

    if (!paymentInfo) {
      return NextResponse.json(
        { error: "Payment information not found" },
        { status: 404 }
      );
    }

    // Remove payment method
    paymentInfo.paymentMethods = paymentInfo.paymentMethods.filter(
      (m: IPaymentMethod) => m._id?.toString() !== paymentMethodId
    );

    // If deleted method was primary and there are other methods, set first one as primary
    if (paymentInfo.paymentMethods.length > 0) {
      paymentInfo.paymentMethods[0].isPrimary = true;
    }

    await paymentInfo.save();

    return NextResponse.json({
      message: "Payment method deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
