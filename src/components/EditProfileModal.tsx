import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, BookText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from './UserAvatar';


interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('lock-scroll');
      window.dispatchEvent(new Event('modalToggle'));
    } else {
      const activeModals = document.querySelectorAll('[data-modal-active="true"]').length;
      if (activeModals <= 1) {
        document.documentElement.classList.remove('lock-scroll');
      }
      window.dispatchEvent(new Event('modalToggle'));
    }
    return () => {
      const activeModals = document.querySelectorAll('[data-modal-active="true"]').length;
      if (activeModals <= 1) {
        document.documentElement.classList.remove('lock-scroll');
      }
      window.dispatchEvent(new Event('modalToggle'));
    };
  }, [isOpen]);

  const handleSave = () => {
    if (user) {
      updateUser({ name });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          data-modal-active="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-bg-dark to-bg-dark/95 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl shadow-black/40 relative"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-white">Edit Profile</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <X size={20} className="text-white/60" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {user && <UserAvatar user={user} className="w-16 h-16 text-xl" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">Profile Photo</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/60 px-2 py-0.5 rounded-full">Synced</span>
                    </div>
                    <p className="text-xs text-white/40 font-medium">
                      Managed by identity provider
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="relative">
                  <User size={16} className="absolute top-1/2 -translate-y-1/2 left-4 text-white/30 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all"
                  />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute top-1/2 -translate-y-1/2 left-4 text-white/30 pointer-events-none" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white/50 cursor-not-allowed"
                  />
                </div>

              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-transparent border border-white/20 rounded-lg font-bold text-sm text-white/80 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-white text-black rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
