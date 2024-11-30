const { Services } = require('../models');
const ImageKit = require('imagekit');

// SDK initialization
var imagekit = new ImageKit({
  publicKey: "public_5J27hETdJ/Qqdmt102EjAbUOOd4=",
  privateKey: "private_rI5739WSAbOayuMXnydJW74H40k=",
  urlEndpoint: "https://ik.imagekit.io/rw05vsmbv"
});

const GetAllServices = async (req, res) => {
  const services = await Services.findAll({ raw: true });
  res.render('services/Services', { Allservices: services }); // Updated to render the services view
};

const AddServiceView = async (req, res) => {
  res.render('services/AddService');
};

const AddService = async (req, res) => {

  const {
    serviceName,
    subDescription,
    description1, description2,
    card1Name, card1Desc,
    card2Name, card2Desc,
    card3Name, card3Desc,
    benefitsDescription,
    benefit1, benefit2, benefit3,
    OurApproachDescription,
    userFriendlyDescription,
    faqDescription,
    faqQuestion1, faqAnswer1,
    faqQuestion2, faqAnswer2,
    faqQuestion3, faqAnswer3,
    faqQuestion4, faqAnswer4,
    faqQuestion5, faqAnswer5,
    metaTitle, metaDescription, metaKeywords, keywordsPlanner, canonical, robots,
    route
  } = req.body;

  const fileUploadPromises = {};

  // Define the expected fields
  const expectedFields = [
    'subImage',
    'mainImage',
    'bannerImage',
    'benefitImage',
    'ourApproachImage',
    'userFriendlyImage'
  ];

  // Iterate over the expected fields to find and upload the files
  for (const field of expectedFields) {
    const uploadedFile = req.files.find(file => file.fieldname === field);

    if (!uploadedFile) {
      return res.status(400).json({ error: `${field} not provided` });
    }

    // Upload to ImageKit
    fileUploadPromises[field] = imagekit.upload({
      file: uploadedFile.buffer,
      fileName: uploadedFile.originalname,
    });
  }

  // Wait for all uploads to complete
  const uploadedFiles = await Promise.all(Object.values(fileUploadPromises));

  // Store the image URLs returned by ImageKit
  const [
    subImageUrl,
    mainImageUrl,
    bannerImageUrl,
    benefitImageUrl,
    ourApproachImageUrl,
    userFriendlyImageUrl
  ] = uploadedFiles.map(file => file.url);

  // Filter out empty cards
  const cards = [
    { name: card1Name, desc: card1Desc },
    { name: card2Name, desc: card2Desc },
    { name: card3Name, desc: card3Desc }
  ].filter(card => card.name && card.desc);

  // Filter out empty benefits
  const points = [benefit1, benefit2, benefit3].filter(point => point);

  // Filter out empty FAQs
  const qa = [
    { question: faqQuestion1, answer: faqAnswer1 },
    { question: faqQuestion2, answer: faqAnswer2 },
    { question: faqQuestion3, answer: faqAnswer3 },
    { question: faqQuestion4, answer: faqAnswer4 },
    { question: faqQuestion5, answer: faqAnswer5 }
  ].filter(q => q.question && q.answer);

  // Trim whitespace for each keyword in the array (optional but recommended)
  const serviceData = {
    status: 1,
    code: `${Math.random().toString(36).substring(2, 7)}-${Date.now().toString().slice(-5)}`,
    serviceName,
    subDescription,
    subImageUrl,
    bannerImageUrl,
    mainImageUrl,
    details: {
      description1,
      description2,
    },
    cards,
    benefits: {
      image: benefitImageUrl,
      description: benefitsDescription,
      points,
    },
    ourApproach: {
      image: userFriendlyImageUrl,
      description: OurApproachDescription
    },
    userFriendly: {
      image: ourApproachImageUrl,
      description: userFriendlyDescription
    },
    faq: {
      description: faqDescription,
      qa
    },
    seo: {
      metaTitle,
      metaDescription,
      metaKeywords,
      keywordsPlanner,
      canonical,
      robots
    },
    route
  };
  // console.log(serviceData, "see the adding service")
  await Services.create(serviceData);
  res.redirect('/services');
};

const EditServiceView = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Services.findByPk(id, { raw: true });

    if (!service) {
      return res.status(404).send('Service not found');
    }

    // Parse JSON strings to objects
    service.details = JSON.parse(service.details);
    service.cards = JSON.parse(service.cards);
    service.benefits = JSON.parse(service.benefits);
    service.faq = JSON.parse(service.faq);
    service.seo = JSON.parse(service.seo);
    service.ourApproach = JSON.parse(service.ourApproach);
    service.userFriendly = JSON.parse(service.userFriendly);
    res.render('services/EditService', { service });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).send('Internal Server Error');
  }
};

const EditService = async (req, res) => {
  const { id } = req.params;
  console.log(req.files, "check this onee")
  // console.log(req.body, "check this onee") 
  const {
    serviceName,
    subDescription,
    description1, description2,
    card1Name, card1Desc,
    card2Name, card2Desc,
    card3Name, card3Desc,
    benefitsDescription,
    benefit1, benefit2, benefit3,
    ourApproachDescription,
    userFriendlyDescription,
    faqDescription,
    faqQuestion1, faqAnswer1,
    faqQuestion2, faqAnswer2,
    faqQuestion3, faqAnswer3,
    faqQuestion4, faqAnswer4,
    faqQuestion5, faqAnswer5,
    metaTitle, metaDescription, metaKeywords, keywordsPlanner, canonical, robots,
    route
  } = req.body;

  // Initialize variables for image URLs
  let subImageUrl, mainImageUrl, bannerImageUrl, benefitImageUrl, ourApproachImageUrl, userFriendlyImageUrl;

  // Fetch existing service from database
  const existingService = await Services.findOne({ where: { id } });

  // Check and handle image uploads
  const uploadImage = async (file) => {
    const uploadResult = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });
    return uploadResult.url;
  };


  const handleImageUpload = async (field, existingUrl) => {
    const uploadedFiles = req.files.filter(file => file.fieldname === field);  // Get all files for the field

    // If files were uploaded for this field, upload the first one and return its URL
    if (uploadedFiles.length > 0) {
      return await uploadImage(uploadedFiles[0]);  // Upload the first file
    } else {
      return existingUrl;  // Use existing image URL
    }
  };

  existingService.benefits = JSON.parse(existingService.benefits);
  existingService.ourApproach = JSON.parse(existingService.ourApproach);
  existingService.userFriendly = JSON.parse(existingService.userFriendly);


  // Handle all image fields
  subImageUrl = await handleImageUpload('subImage', existingService.subImageUrl);
  mainImageUrl = await handleImageUpload('mainImage', existingService.mainImageUrl);
  bannerImageUrl = await handleImageUpload('bannerImage', existingService.bannerImageUrl);
  benefitImageUrl = await handleImageUpload('benefitImage', existingService.benefits.image);
  ourApproachImageUrl = await handleImageUpload('ourApproachImage', existingService.ourApproach.image);
  userFriendlyImageUrl = await handleImageUpload('userFriendlyImage', existingService.userFriendly.image);

  // Filter out empty cards
  const cards = [
    { name: card1Name, desc: card1Desc },
    { name: card2Name, desc: card2Desc },
    { name: card3Name, desc: card3Desc }
  ].filter(card => card.name && card.desc);

  // Filter out empty benefits
  const points = [benefit1, benefit2, benefit3].filter(point => point);

  // Filter out empty FAQs
  const qa = [
    { question: faqQuestion1, answer: faqAnswer1 },
    { question: faqQuestion2, answer: faqAnswer2 },
    { question: faqQuestion3, answer: faqAnswer3 },
    { question: faqQuestion4, answer: faqAnswer4 },
    { question: faqQuestion5, answer: faqAnswer5 }
  ].filter(q => q.question && q.answer);

  // Prepare the service data for update
  const serviceData = {
    serviceName,
    subDescription,
    subImageUrl,
    bannerImageUrl,
    mainImageUrl,
    details: {
      description1,
      description2,
    },
    cards,
    benefits: {
      image: benefitImageUrl,
      description: benefitsDescription,
      points,
    },
    ourApproach: {
      image: ourApproachImageUrl,
      description: ourApproachDescription
    },
    userFriendly: {
      image: userFriendlyImageUrl,
      description: userFriendlyDescription
    },
    faq: {
      description: faqDescription,
      qa
    },
    seo: {
      metaTitle,
      metaDescription,
      metaKeywords,
      keywordsPlanner,
      canonical,
      robots
    },
    route
  };

  // console.log(serviceData, "updated service")

  // Update the service in the database
  await Services.update(serviceData, { where: { id } });

  // Redirect to the services page
  res.redirect('/services');
};

const ChangeStatusService = async (req, res) => {
  try {
    const serviceId = req.params.id
    const service = await Services.findOne({
      where: {
        id: serviceId
      },
      attributes: ['status']
    });

    await Services.update(
      { status: service.status === 1 ? 0 : 1 },
      { where: { id: serviceId } }
    );

    res.redirect('/services');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const DeleteService = async (req, res) => {
  const { id } = req.params;
  await Services.destroy({ where: { id } });
  res.redirect('/services');
};

module.exports = { GetAllServices, AddServiceView, AddService, EditServiceView, EditService, DeleteService, ChangeStatusService };
