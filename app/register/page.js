'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import register from '@/public/register.png';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'technician',
    address: '',
    phone:''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }
      const user = data.user;
      if (!user){
        throw new Error ('User was not created.');
      }
      const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: formData.full_name,
        phone: formData.phone,
        role: formData.role,
        address: formData.address,
      });
    
     

      if (profileError){
        throw profileError;
      }
      if (data.user) {
        setSuccessMessage(
          'Account created. Please check your email for confirmation.'
        );


        setFormData({
          full_name:'',
          id: '',
          role: '',
          address: '',
          phone: ''
        });

        setTimeout(() => {
          router.push('/signIn');
        }, 1500);
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main-container ">
      <div className="background-container flex flex-col ">
        <Image src={register} alt="register" className="w-32 mx-auto mt-2" />
        <h2 className="mx-auto">Create account</h2>
        <p className="steps-text">Register a new user to access the app.</p>

        <form onSubmit={handleSubmit} className="form-no-style ">
          <div>
          <label htmlFor="phone">Full name</label>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
          />
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
             <label htmlFor="email">Address</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
       

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              className="mb-2"
            />
             <label htmlFor="confirmPassword">Select role</label>
            <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="technician">Technician</option>
            <option value="manager">Manager</option>
            <option value="hire_desk">Hire Desk</option>
            <option value="supplier">Supplier</option>
          </select>

       
            <div className="divider-full my-2"></div>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}

          <button type="submit" disabled={loading} className="button-big">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
