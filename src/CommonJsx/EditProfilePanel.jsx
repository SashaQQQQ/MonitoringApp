import { useState, useEffect, useContext } from "react";
import { DataContext } from "../CommonJsx/DataContext.jsx";
import "../Styles/EditProfilePanel.css";
import { supabase } from "../CommonJsx/SupabaseClient.js";
import userIcon from "../Icons/worker.png";
const EditProfilePanel = () => {
    const { userProfile, setUserProfile, setActivePage } = useContext(DataContext);
   
    const [name, setName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(userIcon);

    const [avatarText, setAvatarText] = useState("New you? New avatar");
  
    function handleFileChange(event) {
      const file = event.target.files[0];
     if(!file.type.startsWith("image/")) {

      return;
     } else {
      setAvatarFile(file);
      setAvatarText("Looks good!");
     }
    };
    useEffect(() => {
      if(avatarFile) {
        const objectUrl = URL.createObjectURL(avatarFile);
        setAvatarPreview(objectUrl);
      } else {
        setAvatarPreview(userProfile.avatarUrl || userIcon);
      }
    }, [avatarFile, userProfile]);
    async function uploadAvatar(file) {
      const fileExtension = file.name.split(".").pop();
      const fileName = `${userProfile.id}_${file.name}`;  

      const { data, error } = await supabase.storage.from("avatars")
      .upload(fileName, file);

      if (error) {
        console.error("Error uploading avatar:", error);
        return null;
      }
    const {data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
    
   if(publicUrlData) {
   const {error: updateError} = await supabase.from("users")
   .update({avatarUrl: publicUrlData.publicUrl})
   .eq("id", userProfile.id);
   }

    }
    
    async function handleSaveChanges() {
      const updates = {
        name: name.trim() || userProfile.name,
        secondName: secondName.trim() || userProfile.secondName,
        email: email.trim() || userProfile.email,
    
      };
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }
      
      const {data, error} = await supabase.from("users")
      .update(updates)
      .eq("id", userProfile.id)
      .select()
      .single();

      if (error) {
        console.error("Error updating profile:", error);
        return;
      }
      setUserProfile(data);
      setActivePage("main");
    }

    return (
    <div className="EditProfilePanel">
      <div className="inputColumnImg">
         <div className="avatarInput">
           <label>
             <img src={avatarPreview } alt="picture" />
             <input onChange={(e) => {handleFileChange(e)}} type="file" style={{"display" : "none"}} accept="image/*"/>
            </label>
    
            <p>{avatarText}</p>
        </div>

      </div>
          <div className="inputColumn">
           <h2>Edit Profile</h2>
        
            
             <div className="inputGroup">
            <p>Name</p>
         <input
          type="text"
          placeholder={userProfile?.name || "First Name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        </div>

         <div className="inputGroup">
        <p>Second Name</p>
        <input
          type="text"
          placeholder={userProfile?.secondName || "Last Name"}
          value={secondName}
          onChange={(e) => setSecondName(e.target.value)}
        />
        </div>
          <div className="inputGroup">
         <p>Email</p>
          <input
           type="email"
          placeholder={userProfile?.email || "Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
    
                   </div>
        

        <button onClick={handleSaveChanges} className="saveButton">Save Changes</button>    
          </div>
    </div>
  );
};

export default EditProfilePanel;