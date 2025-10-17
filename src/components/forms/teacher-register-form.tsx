import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { validateEmail, validatePassword } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import React, { useState } from "react";

interface TeacherRegisterFormProps {
  onRegister: (data: TeacherRegisterData) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
}

interface TeacherRegisterData {
  name: string;
  email: string;
  password: string;
  teacherBio: string;
  teacherQualification: string;
}

const TeacherRegisterForm: React.FC<TeacherRegisterFormProps> = ({
  onRegister,
  onSwitchToLogin,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<TeacherRegisterData>({
    name: "",
    email: "",
    password: "",
    teacherBio: "",
    teacherQualification: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (!formData.teacherBio.trim()) {
      newErrors.teacherBio = "Bio is required";
    } else if (formData.teacherBio.trim().length < 50) {
      newErrors.teacherBio = "Bio must be at least 50 characters";
    }

    if (!formData.teacherQualification.trim()) {
      newErrors.teacherQualification = "Qualification is required";
    } else if (formData.teacherQualification.trim().length < 10) {
      newErrors.teacherQualification =
        "Qualification must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onRegister(formData);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Become a Teacher</CardTitle>
        <CardDescription>
          Register to create and manage your English courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}>
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="teacherBio" className="text-sm font-medium">
              Bio
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
              <textarea
                id="teacherBio"
                name="teacherBio"
                placeholder="Tell us about yourself, your teaching experience, and your passion for teaching English..."
                value={formData.teacherBio}
                onChange={handleInputChange}
                rows={4}
                className={`flex w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                  errors.teacherBio ? "border-red-500" : ""
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.teacherBio && (
              <p className="text-sm text-red-500">{errors.teacherBio}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="teacherQualification"
              className="text-sm font-medium">
              Qualification
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
              <textarea
                id="teacherQualification"
                name="teacherQualification"
                placeholder="List your qualifications (e.g., TEFL, TESOL, Bachelor's in English, etc.)"
                value={formData.teacherQualification}
                onChange={handleInputChange}
                rows={3}
                className={`flex w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                  errors.teacherQualification ? "border-red-500" : ""
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.teacherQualification && (
              <p className="text-sm text-red-500">
                {errors.teacherQualification}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Your application will be reviewed by an
              admin. You'll be able to create courses once approved.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting application...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline font-medium"
              disabled={isLoading}>
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherRegisterForm;
