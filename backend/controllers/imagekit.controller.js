import ImageKit from "imagekit";
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
const getAuth = (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  res.json(authParams);
};
const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const timestamp = new Date().toISOString();
    const fileName = file.originalname + "_" + timestamp;
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: fileName,
      folder: "LMS",
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Upload thất bại", error });
  }
};
export { getAuth, uploadFile };
