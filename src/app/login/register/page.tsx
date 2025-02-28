"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserService } from "@/services/userService";
import { CheckDuplicateRequest, RegisterRequest } from "@/types/user.type";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        birthdate: "",
        gender: "male",
        email: "",
        phone: "",
        image: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString().split(",")[1];
                setFormData({ ...formData, image: base64String || "" });
            };
            reader.readAsDataURL(file);
        }
    };

    const checkDuplicateData = async (data: string, dataType: string): Promise<boolean> => {
        const request: CheckDuplicateRequest = {
            data,
            data_type: dataType
        }
        const response = await UserService.checkDuplicateData(request)
        return response.is_duplicate
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username.trim() || !formData.password.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.firstName.trim() || !formData.lastName.trim() || !formData.gender || !formData.image.trim()) {
            setError("All fields are required.");
            return;
        }
        const isDuplicateUsername = await checkDuplicateData(formData.username.trim(), "username")
        if (isDuplicateUsername) {
            setError("Username is already in use")
            return
        }
        const isDuplicateEmail = await checkDuplicateData(formData.email.trim(), "email")
        if (isDuplicateEmail) {
            setError("Email is already in use")
            return
        }
        const isDuplicatePhone = await checkDuplicateData(formData.phone.trim(), "phone")
        if (isDuplicatePhone) {
            setError("Phone number is already in use")
            return
        }

        const registerRequest: RegisterRequest = {
            username: formData.username.trim(),
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            password: formData.password.trim(),
            birth_date: formData.birthdate.trim(),
            gender: formData.gender,
            email: formData.email.trim(),
            phone: formData.phone,
            image: formData.image
        }

        const response = await UserService.register(registerRequest)
        if (response.success) {
            router.push("/login")
        }

        setError("");
        console.log("Registering user:", formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <Card className="w-full max-w-4xl shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-primary text-2xl font-bold">Register</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                    <form onSubmit={handleRegister} className="grid grid-cols-2 gap-4">
                        <Input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                        <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                        <Input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                        <Input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                        <Input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
                        <div>
                            <Label className="block mb-2">Gender</Label>
                            <RadioGroup defaultValue={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                                <div className="flex items-center space-x-4">
                                    <Label className="flex items-center space-x-2">
                                        <RadioGroupItem value="male" />
                                        <span>Male</span>
                                    </Label>
                                    <Label className="flex items-center space-x-2">
                                        <RadioGroupItem value="female" />
                                        <span>Female</span>
                                    </Label>
                                    <Label className="flex items-center space-x-2">
                                        <RadioGroupItem value="other" />
                                        <span>Other</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                        <Input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
                        <Input type="file" accept="image/*" onChange={handleImageChange} className="col-span-2" />
                        <Button type="submit" className="col-span-2 w-full">Register</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
