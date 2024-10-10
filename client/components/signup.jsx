import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import {localhost} from '../url'
import { useRouter } from 'next/navigation';


const SignupComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const router = useRouter()


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(localhost+'/api/signup', formData);
      console.log("Signup success",response.data);
      setLoading(false)
      router.push('/login')
    } catch (error) {
      setApiError('Signup failed. Please try again.');
      console.error(error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
      <a>
        <div className="text-foreground font-semibold text-2xl tracking-tighter mx-auto flex items-center gap-2">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5"
              />
            </svg>
          </div>
          Stockify
        </div>
      </a>

      <div className="relative mt-12 w-full max-w-lg sm:mt-10">
        <div className="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
        <div className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
          <div className="flex flex-col p-6">
            <h3 className="text-xl font-semibold leading-6 tracking-tighter">Sign Up</h3>
            <p className="mt-1.5 text-sm font-medium text-white/50">
              Create your account by entering your details below.
            </p>
          </div>

          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div>
                <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                      Name
                    </label>
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    autoComplete="off"
                    className="block w-full border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>
              </div>

              <div className="mt-4">
                <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                      Email
                    </label>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    autoComplete="off"
                    className="block w-full border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="mt-4">
                <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                      Password
                    </label>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="block w-full border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <p className="text-red-500">{errors.password}</p>}
                </div>
              </div>

              <div className="mt-4">
                <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                      Confirm Password
                    </label>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="block w-full border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4 flex items-center justify-end gap-x-2">
                <button
                  type="submit"
                  className={`font-semibold transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-black hover:text-white hover:ring hover:ring-white'}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                        viewBox="0 0 100 101"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.241c0-27.61-22.388-50-50-50S0 22.631 0 50.241 22.388 101 50 101c13.44 0 25.744-5.22 34.985-13.82l-9.448-9.24C66.966 94.19 58.662 100 50 100 27.153 100 8 80.847 8 50.241c0-29.39 23.92-53.285 53.579-49.97-2.087 4.133-3.579 8.517-3.579 13.01 0 16.942 13.508 30.44 30.44 30.44 4.93 0 9.658-1.086 14.03-3.023C97.766 49.4 100 49.887 100 50.241z"
                          fill="currentColor"
                        />
                      </svg>
                      Signing up...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>

              {apiError && <p className="text-red-500 mt-4">{apiError}</p>}
            </form>
          </div>
        </div>
      </div>

      <p className="mt-2 text-sm text-white/50">
        Already have an account?{' '}
        <Link href="/login" className="text-sky-300 hover:text-sky-500">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default SignupComponent;
