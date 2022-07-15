import React from "react";
import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
} from "@mantine/core";

export const LoginAuntification = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className="min-height center ">
      <Container size={420}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Title align="center">Admin</Title>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              label="username"
              placeholder="enter username"
              {...register("username")}
              style={errors.username && { border: "1px solid red" }}
            />
            <PasswordInput
              label="password"
              placeholder="enter password"
              {...register("password")}
              style={errors.username && { border: "1px solid red" }}
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
};
