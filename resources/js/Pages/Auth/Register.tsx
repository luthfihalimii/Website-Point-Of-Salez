import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className='flex flex-col gap-6'>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Register</CardTitle>
                        <CardDescription>
                            Enter your data to create new account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className="flex flex-col gap-6">

                                <div className='flex gap-4'>
                                    <div className="flex-1">
                                        <Label htmlFor="email">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            disabled={processing}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className={cn(
                                                errors.name ? "border-red-600 border-1 "
                                                    : "", "input-base-class"
                                            )}
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="flex-1">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}

                                            onChange={(e) => setData("email", e.target.value)}
                                            className={cn(
                                                errors.email ? "border-red-600 border-1 " : "", "input-base-class"
                                            )}
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                <div className='flex gap-4'>
                                    <div className="flex-1">
                                        <Label htmlFor="email">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}

                                            onChange={(e) => setData("password", e.target.value)}
                                            className={cn(
                                                errors.password ? "border-red-600 border-1 "
                                                    : "", "input-base-class"
                                            )}
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex-1">
                                        <Label htmlFor="email">Password Conrfirmation</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}

                                            onChange={(e) => setData("password_confirmation", e.target.value)}
                                            className={cn(
                                                errors.password_confirmation ? "border-red-600 border-1 "
                                                    : "", "input-base-class"
                                            )}
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>


                                <Button type="submit" className="w-full">
                                    Register
                                </Button>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Already have an account?{" "}
                                <Link href={route('login')}
                                    className="underline underline-offset-4">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </GuestLayout>
    );
}
