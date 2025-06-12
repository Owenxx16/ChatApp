import React from 'react'

const ProfilePage = () => {
<<<<<<< HEAD
  const {authUser, isUpdatingProfile, uploadProfile} = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageUpload = async (e) => {
    const files = e.target.files[0];
    if(!files) return;

    const reader = new FileReader();
    reader.readAsDataURL(files);
    
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await uploadProfile({profilePic: base64Image});
    }
  };
=======
>>>>>>> parent of 1076882 (Done ProfilePage)
  return (
    <div>
      aa
    </div>
  )
}

export default ProfilePage
