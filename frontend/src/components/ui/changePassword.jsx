import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import api from "../../libs/apiCall";
import Input from "./input";
import { BiLoader } from "react-icons/bi";
import { Button } from "./button";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const submitPasswordHandler = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.put("/user/change-password", data);

      if (res?.status === "success") {
        toast.success(res?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20">
      <form onSubmit={handleSubmit(submitPasswordHandler)}>
        <p className="text-xl font-bold text-black dark:text-white mb-1">
          Change Password
        </p>
        <span className="labelStyles">
          This will be used to log into your account.
        </span>
        <div className="mt-6 space-y-6">
          <Input
            disabled={loading}
            type="password"
            placeholder="Current Password"
            name="currentPassword"
            label="Current Password"
            {...register("currentPassword", {
              required: "Current Password is required",
            })}
            error={errors.currentPassword ? errors.currentPassword.message : ""}
            className="text-sm border dark:border-gray-800 dark:bg-transparent dark:
          placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
          <Input
            disabled={loading}
            type="password"
            placeholder="New Password"
            name="newPassword"
            label="New Password"
            {...register("newPassword", {
              required: "New Password is required",
            })}
            error={errors.NewPassword ? errors.NewPassword.message : ""}
            className="text-sm border dark:border-gray-800 dark:bg-transparent dark:
          placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
          <Input
            disabled={loading}
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            label="Confirm Password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) => {
                const { newPassword } = getValues();
                return value === newPassword || "Passwords do not match";
              },
            })}
            error={errors.confirmPassword ? errors.confirmPassword.message : ""}
            className="text-sm border dark:border-gray-800 dark:bg-transparent dark:
          placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
          <div className="flex flex-col items-center md:flex-row justify-end gap-4 my-4">
            <Button
              variant="outline"
              loading={loading}
              type="reset"
              className="px-6 bg-transparent text-black dark:text-white-border border-gray-200 dark:border-gray-700"
            >
              Reset
            </Button>

            <Button
              loading={loading}
              type="submit"
              className="px-8 bg-violet-800 text-white"
            >
              {loading ? (
                <BiLoader className="animate-spin" />
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
