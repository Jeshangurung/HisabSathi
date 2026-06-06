import { Link } from "react-router-dom";

import Button from "../../../components/common/Button.jsx";
import Card from "../../../components/common/Card.jsx";
import Input from "../../../components/common/Input.jsx";
import PageHeader from "../../../components/common/PageHeader.jsx";


export default function ProfilePage() {
  return (
    <>
      <PageHeader
        actions={
          <Link to="/profile/payment">
            <Button variant="secondary">Payment profile</Button>
          </Link>
        }
        description="Manage your public profile details used across groups and settlements."
        eyebrow="Profile"
        title="Your profile"
      />
      <Card className="max-w-3xl">
        <form className="grid gap-4 md:grid-cols-2">
          <Input label="Full name" defaultValue="Sita Gurung" />
          <Input label="Username" defaultValue="sita" />
          <Input label="Email" defaultValue="sita@example.com" type="email" />
          <Input label="Phone number" defaultValue="9800000000" />
          <div className="md:col-span-2">
            <Button>Save profile</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
