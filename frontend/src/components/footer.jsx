import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeEmail, unsubscribeNewsletter } from '@/lib/store/features/newsletter/newsletterSlice';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function Footer() {
  const [email, setEmail] = useState('');
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const [unsubscribeEmail, setUnsubscribeEmail] = useState('');
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.newsletter);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    const result = await dispatch(subscribeEmail({ email }));
    if (!result.error) {
      setEmail('');
    } else {
      toast.error(result.payload || 'Failed to subscribe');
    }
  };

  const handleUnsubscribe = async () => {
    if (!unsubscribeEmail) {
      toast.error('Email is required');
      return;
    }

    const result = await dispatch(unsubscribeNewsletter(unsubscribeEmail));
    if (!result.error) {
      setShowUnsubscribe(false);
      setUnsubscribeEmail('');
    } else {
      toast.error(result.payload || 'Failed to unsubscribe');
    }
  };

  return (
    <>
      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-6 mt-20 mb-6 px-6 sm:px-10 lg:px-20">
        
        <div className="sm:col-span-2 lg:col-span-1">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Flexxy</h1>
          <p className="mt-3 text-gray-500 text-base leading-relaxed max-w-xs">
            Quality fashion, redefined. Style meets comfort.
          </p>
        </div>

        <div>
          <p className="text-2xl font-semibold tracking-tight text-gray-900">Links</p>
          <ul className="mt-3 flex flex-col gap-3 text-gray-500 text-base">
            <Link to='/shop/home'><li className="hover:text-gray-900 transition-colors cursor-pointer">Home</li></Link>
            <Link to='/shop/listing'><li className="hover:text-gray-900 transition-colors cursor-pointer">Shop</li></Link>
          </ul>
        </div>

        <div>
          <p className="text-2xl font-semibold tracking-tight text-gray-900">Contact</p>
          <ul className="mt-3 flex flex-col gap-3 text-gray-500 text-base">
            <a href="tel:+94787529260"><li className="hover:text-gray-900 transition-colors cursor-pointer">+94 78 752 9260</li></a>
            <a href="mailto:hello@flexxy.com"><li className="hover:text-gray-900 transition-colors cursor-pointer">hello@flexxy.com</li></a>
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-2xl font-semibold tracking-tight text-gray-900">Newsletter</p>
          <p className="mt-3 text-gray-500 text-base max-w-xs">Subscribe for updates on trends and offers.</p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="p-3 bg-gray-100 border-none rounded-md text-base text-gray-700 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gray-900 text-white p-3 rounded-md text-base font-medium w-full sm:w-28 hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Joining...' : 'Join'}
            </button>
          </form>
          <p className="mt-2 text-sm text-gray-500">
            <button
              onClick={() => setShowUnsubscribe(true)}
              className="hover:text-gray-900 transition-colors"
            >
              Unsubscribe from newsletter
            </button>
          </p>

          <Dialog open={showUnsubscribe} onOpenChange={setShowUnsubscribe}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Unsubscribe from Newsletter</DialogTitle>
                <DialogDescription>
                  Enter your email address to unsubscribe from our newsletter.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <input
                    type="email"
                    value={unsubscribeEmail}
                    onChange={(e) => setUnsubscribeEmail(e.target.value)}
                    placeholder="Your email"
                    className="p-3 bg-gray-100 border-none rounded-md text-base text-gray-700 w-full focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <DialogFooter>
                <button
                  onClick={() => setShowUnsubscribe(false)}
                  className="bg-gray-200 text-gray-800 p-3 rounded-md text-base font-medium hover:bg-gray-300 transition-all"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnsubscribe}
                  disabled={isLoading}
                  className="bg-gray-900 text-white p-3 rounded-md text-base font-medium hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Unsubscribe'}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border-t border-gray-100 py-4">
        <p className="text-center text-sm text-gray-400 tracking-wide">
          © 2024 Flexxy. All rights reserved.
        </p>
      </div>
    </>
  );
}

export default Footer;