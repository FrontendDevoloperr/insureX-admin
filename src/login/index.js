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
import { login, setRole } from "../redux/reducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    axios
      .post(`${_URL}/account/login`, getFormData(data))
      .then((res) => {
        if (
          res?.data?.message?.user?.role === "superadmin" ||
          res?.data?.message?.user?.role === "insurance_company" ||
          res?.data?.message?.user?.role === "appraisal_company"
        ) {
          toast.success("Login Successful");
          dispatch(login(true));
          dispatch(setRole(res?.data?.message?.user?.role));
          navigate("/persons");
        } else toast.error("Role Failed");
      })
      .catch((err) => {
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
            <Button fullWidth mt="xl" type="submit">
              Войти
            </Button>
          </Paper>
        </form>
      </Container>
    </div>
  );
}
