import React from "react";
import { useForm } from "react-hook-form";
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
} from "@mantine/core";
import axios from "axios";
import toast from "react-hot-toast";
import { getFormData, _URL } from "../utils";
import {
  isAppraisalCompany,
  isInsuranceCompany,
  login,
  setRole,
} from "../redux/reducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    setLoading(true);
    axios
      .post(`${_URL}/account/login`, getFormData(data))
      .then((res) => {
        setLoading(false);
        if (
          res?.data?.message?.user?.role === "superadmin" ||
          res?.data?.message?.user?.role === "insurance_company" ||
          res?.data?.message?.user?.role === "appraisal_company"
        ) {
          toast.success("Login Successful");
          dispatch(login(true));
          dispatch(setRole(res?.data?.message?.user?.role));
          localStorage.setItem(
            "admin-panel-token-insure-x",
            JSON.stringify({
              auth: true,
              role: res?.data?.message?.user?.role,
              token: res?.data?.message?.token,
              insurance_company: res?.data?.message?.user?.insurance_company,
              appraisal_company: res?.data?.message?.user?.appraisal_company,
            })
          );
          if (typeof res?.data?.message?.user?.insurance_company === "object") {
            dispatch(
              isInsuranceCompany(res?.data?.message?.user?.insurance_company)
            );
            navigate("/");
          }
          if (typeof res?.data?.message?.user?.appraisal_company === "object") {
            dispatch(
              isAppraisalCompany(res?.data?.message?.user?.appraisal_company)
            );
            navigate("/");
          }
        } else toast.error("Role Failed");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error("Login Failed");
      });
  };

  return (
    <div className="min-height center">
      <Container size={420} mt={30}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Title align="center">Admin</Title>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              error={errors.username ? true : false}
              label="username"
              placeholder="enter username"
              {...register("username", { required: true })}
            />
            <PasswordInput
              error={errors.password ? true : false}
              label="password"
              placeholder="enter password"
              {...register("password", { required: true })}
              mt="md"
            />
            <Button fullWidth mt="xl" type="submit" loading={loading}>
              Log In
            </Button>
          </Paper>
        </form>
      </Container>
    </div>
  );
}
