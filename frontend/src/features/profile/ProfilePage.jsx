import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import Button from "../../components/common/Button.jsx";
import Card from "../../components/common/Card.jsx";
import Input from "../../components/common/Input.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { useApi } from "../../hooks/useApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import { getProfile, updateProfile } from "./profileService.js";


export default function ProfilePage() {
  const { setUser } = useAuth();
  const profileApi = useApi(getProfile, []);
  const [form, setForm] = useState({ email: "", full_name: "", phone_number: "", username: "" });

  useEffect(() => {
    if (profileApi.data) {
      setForm({
        email: profileApi.data.email ?? "",
        full_name: profileApi.data.full_name ?? "",
        phone_number: profileApi.data.phone_number ?? "",
        username: profileApi.data.username ?? "",
      });
    }
  }, [profileApi.data]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const data = await updateProfile(form);
    setUser(data);
    toast.success("Profile updated.");
  };

  if (profileApi.isLoading) return <Loader label="Loading profile" />;

  return (
    <>
      <PageHeader
        actions={<Link to="/profile/payment"><Button variant="secondary">Payment profile</Button></Link>}
        description="Keep your identity details fresh for groups, settlements, and reminders."
        eyebrow="Profile"
        title="Your profile"
      />
      <Card className="max-w-3xl">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <Input label="Full name" name="full_name" onChange={update} value={form.full_name} />
          <Input label="Username" name="username" onChange={update} value={form.username} />
          <Input label="Email" name="email" onChange={update} type="email" value={form.email} />
          <Input label="Phone number" name="phone_number" onChange={update} value={form.phone_number} />
          <div className="md:col-span-2">
            <Button type="submit">Save profile</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
