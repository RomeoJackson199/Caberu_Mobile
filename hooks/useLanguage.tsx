import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Language = "en" | "fr" | "nl";

interface Translations {
  // Error & status messages
  error: string;
  success: string;
  microphoneAccessError: string;
  transcriptionFailed: string;
  voiceProcessingError: string;
  // General
  settings: string;
  general: string;
  theme: string;
  personal: string;
  language: string;
  light: string;
  dark: string;
  save: string;
  confirm: string;
  cancel: string;
  close: string;
  retry: string;
  // Personal Info
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  medicalHistory: string;
  personalInformation: string;
  savePersonalInfo: string;
  address: string;
  emergencyContact: string;
  enterAddress: string;
  enterEmergencyContact: string;
  // Messages
  languageUpdated: string;
  languageChangedTo: string;
  themeUpdated: string;
  switchedToMode: string;
  personalInfoSaved: string;
  personalInfoUpdated: string;
  informationConfirmed: string;
  changesSaved: string;
  privacyNotice: string;
  // Auth
  signOut: string;
  signIn: string;
  signUp: string;
  createAccount: string;
  email: string;
  password: string;
  phone: string;
  optional: string;
  welcome: string;
  accessDentiBot: string;
  signInOrCreate: string;
  signInButton: string;
  createAccountButton: string;
  accountCreatedSuccess: string;
  checkEmailConfirm: string;
  signUpError: string;
  signInError: string;
  signInSuccess: string;
  welcomeToDentiBot: string;
  continueWithGoogle: string;
  or: string;
  // Placeholders
  enterFirstName: string;
  enterLastName: string;
  enterPhoneNumber: string;
  enterMedicalHistory: string;
  selectLanguage: string;
  enterEmail: string;
  enterPassword: string;
  // Dental Chat
  dentalAssistant: string;
  typeMessage: string;
  send: string;
  welcomeMessage: string;
  detailedWelcomeMessage: string;
  // Landing page
  intelligentDentalAssistant: string;
  experienceFuture: string;
  viewOurDentists: string;
  aiDiagnosis: string;
  aiDiagnosisDesc: string;
  smartBooking: string;
  smartBookingDesc: string;
  support24_7: string;
  support24_7Desc: string;
  initializingExperience: string;
  preparingAssistant: string;
  // Navigation
  chat: string;
  appointments: string;
  // Appointment booking
  bookAppointment: string;
  bookConsultationDescription: string;
  chooseDentist: string;
  selectDate: string;
  selectTime: string;
  availableSlots: string;
  consultationReason: string;
  generalConsultation: string;
  routineCheckup: string;
  dentalPain: string;
  emergency: string;
  cleaning: string;
  other: string;
  bookNow: string;
  appointmentConfirmed: string;
  errorTitle: string;
  cannotLoadSlots: string;
  cannotLoadDentists: string;
  missingInformation: string;
  selectDentistDateTime: string;
  slotNoLongerAvailable: string;
  cannotCreateAppointment: string;
  // Appointments list
  myAppointments: string;
  appointmentHistory: string;
  upcomingAppointments: string;
  pastAppointments: string;
  newAppointment: string;
  appointmentDetails: string;
  loading: string;
  noUpcomingAppointments: string;
  noPastAppointments: string;
  reschedule: string;
  cancelAppointment: string;
  confirmCancellation: string;
  confirmCancellationMessage: string;
  keepAppointment: string;
  yesCancelAppointment: string;
  appointmentCancelled: string;
  failedToCancelAppointment: string;
  // Onboarding
  welcomeToFirstSmile: string;
  yourAIDentalAssistant: string;
  onboardingIntro: string;
  smartFeaturesService: string;
  aiChat: string;
  aiChatDesc: string;
  photoAnalysis: string;
  photoAnalysisDesc: string;
  familyCare: string;
  familyCareDesc: string;
  letsStart: string;
  next: string;
  back: string;
  skip: string;
  // Language selection
  selectPreferredLanguage: string;
  languageSelectionDescription: string;
}

const translations: Record<Language, Translations> = {
  en: {
    error: "Error",
    success: "Success",
    microphoneAccessError:
      "Cannot access microphone. Please check your permissions.",
    transcriptionFailed:
      "Voice transcription failed. Please try again or type your message.",
    voiceProcessingError: "Error processing voice message. Please try again.",
    settings: "Settings",
    general: "General",
    theme: "Theme",
    personal: "Personal",
    language: "Preferred Language",
    light: "Light",
    dark: "Dark",
    save: "Save",
    confirm: "Confirm",
    cancel: "Cancel",
    close: "Close",
    retry: "Retry",
    firstName: "First Name",
    lastName: "Last Name",
    phoneNumber: "Phone Number",
    dateOfBirth: "Date of Birth",
    medicalHistory: "Medical History",
    personalInformation: "Personal Information",
    savePersonalInfo: "Save Personal Information",
    address: "Address",
    emergencyContact: "Emergency Contact",
    enterAddress: "Enter your address",
    enterEmergencyContact: "Enter emergency contact information",
    languageUpdated: "Language Updated",
    languageChangedTo: "Language changed to",
    themeUpdated: "Theme Updated",
    switchedToMode: "Switched to",
    personalInfoSaved: "Personal Information Saved",
    personalInfoUpdated: "Your information has been updated successfully.",
    informationConfirmed: "Information Confirmed",
    changesSaved: "Changes Saved",
    privacyNotice:
      "Your personal and medical data is protected according to our privacy policy.",
    signOut: "Sign Out",
    signIn: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create Account",
    email: "Email",
    password: "Password",
    phone: "Phone",
    optional: "optional",
    welcome: "Welcome",
    accessDentiBot: "Access DentiBot",
    signInOrCreate: "Sign in or create an account to get started",
    signInButton: "Sign in",
    createAccountButton: "Create account",
    accountCreatedSuccess: "Account created successfully!",
    checkEmailConfirm: "Check your email to confirm your account.",
    signUpError: "Sign up error",
    signInError: "Sign in error",
    signInSuccess: "Sign in successful!",
    welcomeToDentiBot: "Welcome to DentiBot.",
    continueWithGoogle: "Continue with Google",
    or: "or",
    enterFirstName: "Enter your first name",
    enterLastName: "Enter your last name",
    enterPhoneNumber: "Enter your phone number",
    enterMedicalHistory:
      "Enter relevant medical history, allergies, medications, etc.",
    selectLanguage: "Select language",
    enterEmail: "your@email.com",
    enterPassword: "Enter your password",
    dentalAssistant: "Dental Assistant",
    typeMessage: "Type your message...",
    send: "Send",
    welcomeMessage: "Hello! I'm DentiBot. How can I help you today?",
    detailedWelcomeMessage: `Welcome to First Smile AI!

I'm your AI dental assistant, available 24/7 to help you with:

- AI Chat - Get instant answers to your dental questions
- Smart Booking - Book appointments intelligently with duration info
- Photo Analysis - Upload photos for AI-powered dental analysis
- Family Care - Book appointments for yourself or family members

Pro Tip: Just tell me what's bothering you, and I'll guide you through everything!

How can I help you today?`,
    intelligentDentalAssistant: "Your Intelligent Dental Assistant 24/7",
    experienceFuture:
      "Experience the future of dental care with AI-powered consultations, smart appointment booking, and personalized treatment recommendations.",
    viewOurDentists: "View Our Dentists",
    aiDiagnosis: "AI Diagnosis",
    aiDiagnosisDesc: "Get instant AI-powered assessments",
    smartBooking: "Smart Booking",
    smartBookingDesc: "Book appointments intelligently",
    support24_7: "24/7 Support",
    support24_7Desc: "Round-the-clock assistance",
    initializingExperience: "Initializing your experience",
    preparingAssistant:
      "Preparing your personalized dental assistant powered by advanced AI technology",
    chat: "Chat",
    appointments: "Appointments",
    bookAppointment: "Book Appointment",
    bookConsultationDescription:
      "Book your dental consultation in just a few taps",
    chooseDentist: "Choose Dentist",
    selectDate: "Select Date",
    selectTime: "Select Time",
    availableSlots: "Available Slots",
    consultationReason: "Consultation Reason",
    generalConsultation: "General consultation",
    routineCheckup: "Routine checkup",
    dentalPain: "Dental pain",
    emergency: "Emergency",
    cleaning: "Cleaning",
    other: "Other",
    bookNow: "Book Now",
    appointmentConfirmed: "Appointment confirmed!",
    errorTitle: "Error",
    cannotLoadSlots: "Unable to load available slots",
    cannotLoadDentists: "Unable to load dentist list",
    missingInformation: "Missing information",
    selectDentistDateTime: "Please select a dentist, date and time",
    slotNoLongerAvailable: "This slot is no longer available",
    cannotCreateAppointment: "Unable to create appointment",
    myAppointments: "My Appointments",
    appointmentHistory: "Appointment History",
    upcomingAppointments: "Upcoming Appointments",
    pastAppointments: "Past Appointments",
    newAppointment: "New",
    appointmentDetails: "Appointment Details",
    loading: "Loading...",
    noUpcomingAppointments: "No upcoming appointments",
    noPastAppointments: "No past appointments",
    reschedule: "Reschedule",
    cancelAppointment: "Cancel",
    confirmCancellation: "Cancel Appointment",
    confirmCancellationMessage:
      "Are you sure you want to cancel this appointment? This action cannot be undone.",
    keepAppointment: "Keep Appointment",
    yesCancelAppointment: "Yes, Cancel",
    appointmentCancelled: "Appointment cancelled successfully",
    failedToCancelAppointment: "Failed to cancel appointment",
    welcomeToFirstSmile: "Welcome to First Smile AI!",
    yourAIDentalAssistant: "Your AI Dental Assistant",
    onboardingIntro:
      "I'm here to help you with all your dental needs, 24/7. Let me show you what I can do!",
    smartFeaturesService: "Smart Features at Your Service",
    aiChat: "AI Chat",
    aiChatDesc: "Get instant answers to dental questions",
    photoAnalysis: "Photo Analysis",
    photoAnalysisDesc: "Upload photos for AI analysis",
    familyCare: "Family Care",
    familyCareDesc: "Book for family members too",
    letsStart: "Let's Start!",
    next: "Next",
    back: "Back",
    skip: "Skip",
    selectPreferredLanguage: "Select Your Preferred Language",
    languageSelectionDescription:
      "Choose your language to get started with First Smile AI",
  },
  fr: {
    error: "Erreur",
    success: "Succes",
    microphoneAccessError:
      "Impossible d'acceder au microphone. Veuillez verifier vos autorisations.",
    transcriptionFailed:
      "Echec de la transcription vocale. Veuillez reessayer ou taper votre message.",
    voiceProcessingError:
      "Erreur lors du traitement du message vocal. Veuillez reessayer.",
    settings: "Parametres",
    general: "General",
    theme: "Theme",
    personal: "Personnel",
    language: "Langue preferee",
    light: "Clair",
    dark: "Sombre",
    save: "Enregistrer",
    confirm: "Confirmer",
    cancel: "Annuler",
    close: "Fermer",
    retry: "Reessayer",
    firstName: "Prenom",
    lastName: "Nom de famille",
    phoneNumber: "Numero de telephone",
    dateOfBirth: "Date de naissance",
    medicalHistory: "Antecedents medicaux",
    personalInformation: "Informations personnelles",
    savePersonalInfo: "Enregistrer les informations personnelles",
    address: "Adresse",
    emergencyContact: "Contact d'urgence",
    enterAddress: "Entrez votre adresse",
    enterEmergencyContact: "Entrez les informations de contact d'urgence",
    languageUpdated: "Langue mise a jour",
    languageChangedTo: "Langue changee en",
    themeUpdated: "Theme mis a jour",
    switchedToMode: "Bascule en mode",
    personalInfoSaved: "Informations personnelles enregistrees",
    personalInfoUpdated: "Vos informations ont ete mises a jour avec succes.",
    informationConfirmed: "Informations Confirmees",
    changesSaved: "Modifications Enregistrees",
    privacyNotice:
      "Vos donnees personnelles et medicales sont protegees selon notre politique de confidentialite.",
    signOut: "Se deconnecter",
    signIn: "Connexion",
    signUp: "Inscription",
    createAccount: "Creer un compte",
    email: "Email",
    password: "Mot de passe",
    phone: "Telephone",
    optional: "optionnel",
    welcome: "Bienvenue",
    accessDentiBot: "Acces a DentiBot",
    signInOrCreate: "Connectez-vous ou creez un compte pour commencer",
    signInButton: "Se connecter",
    createAccountButton: "Creer un compte",
    accountCreatedSuccess: "Compte cree avec succes !",
    checkEmailConfirm: "Verifiez votre email pour confirmer votre compte.",
    signUpError: "Erreur lors de l'inscription",
    signInError: "Erreur lors de la connexion",
    signInSuccess: "Connexion reussie !",
    welcomeToDentiBot: "Bienvenue sur DentiBot.",
    continueWithGoogle: "Continuer avec Google",
    or: "ou",
    enterFirstName: "Entrez votre prenom",
    enterLastName: "Entrez votre nom de famille",
    enterPhoneNumber: "Entrez votre numero de telephone",
    enterMedicalHistory:
      "Entrez les antecedents medicaux pertinents, allergies, medicaments, etc.",
    selectLanguage: "Selectionner la langue",
    enterEmail: "votre@email.com",
    enterPassword: "Entrez votre mot de passe",
    dentalAssistant: "Assistant dentaire",
    typeMessage: "Tapez votre message...",
    send: "Envoyer",
    welcomeMessage: "Bonjour ! Je suis DentiBot. Comment puis-je vous aider ?",
    detailedWelcomeMessage: `Bienvenue sur First Smile AI !

Je suis votre assistant dentaire IA, disponible 24h/24 pour vous aider avec :

- Chat IA - Obtenez des reponses instantanees a vos questions dentaires
- Reservation Intelligente - Reservez des rendez-vous intelligemment
- Analyse Photo - Telechargez des photos pour une analyse dentaire
- Soins Familiaux - Reservez des rendez-vous pour vous ou votre famille

Astuce Pro : Dites-moi simplement ce qui vous derange !

Comment puis-je vous aider aujourd'hui ?`,
    intelligentDentalAssistant: "Votre Assistant Dentaire Intelligent 24h/24",
    experienceFuture:
      "Decouvrez l'avenir des soins dentaires avec des consultations IA et une prise de rendez-vous intelligente.",
    viewOurDentists: "Voir Nos Dentistes",
    aiDiagnosis: "Diagnostic IA",
    aiDiagnosisDesc: "Obtenez des evaluations instantanees",
    smartBooking: "Reservation Intelligente",
    smartBookingDesc: "Reservez des rendez-vous intelligemment",
    support24_7: "Support 24h/24",
    support24_7Desc: "Assistance permanente",
    initializingExperience: "Initialisation de votre experience",
    preparingAssistant:
      "Preparation de votre assistant dentaire personnalise avec technologie IA avancee",
    chat: "Chat",
    appointments: "Rendez-vous",
    bookAppointment: "Prendre Rendez-vous",
    bookConsultationDescription:
      "Reservez votre consultation dentaire en quelques clics",
    chooseDentist: "Choisir un Dentiste",
    selectDate: "Selectionner une Date",
    selectTime: "Selectionner l'Heure",
    availableSlots: "Creneaux Disponibles",
    consultationReason: "Motif de Consultation",
    generalConsultation: "Consultation generale",
    routineCheckup: "Controle de routine",
    dentalPain: "Douleur dentaire",
    emergency: "Urgence",
    cleaning: "Nettoyage",
    other: "Autre",
    bookNow: "Reserver Maintenant",
    appointmentConfirmed: "Rendez-vous confirme !",
    errorTitle: "Erreur",
    cannotLoadSlots: "Impossible de charger les creneaux disponibles",
    cannotLoadDentists: "Impossible de charger la liste des dentistes",
    missingInformation: "Informations manquantes",
    selectDentistDateTime:
      "Veuillez selectionner un dentiste, une date et une heure",
    slotNoLongerAvailable: "Ce creneau n'est plus disponible",
    cannotCreateAppointment: "Impossible de creer le rendez-vous",
    myAppointments: "Mes Rendez-vous",
    appointmentHistory: "Historique des Rendez-vous",
    upcomingAppointments: "Rendez-vous a Venir",
    pastAppointments: "Rendez-vous Passes",
    newAppointment: "Nouveau",
    appointmentDetails: "Details du Rendez-vous",
    loading: "Chargement...",
    noUpcomingAppointments: "Aucun rendez-vous a venir",
    noPastAppointments: "Aucun rendez-vous passe",
    reschedule: "Reprogrammer",
    cancelAppointment: "Annuler",
    confirmCancellation: "Annuler le Rendez-vous",
    confirmCancellationMessage:
      "Etes-vous sur de vouloir annuler ce rendez-vous ?",
    keepAppointment: "Garder le Rendez-vous",
    yesCancelAppointment: "Oui, Annuler",
    appointmentCancelled: "Rendez-vous annule avec succes",
    failedToCancelAppointment: "Echec de l'annulation du rendez-vous",
    welcomeToFirstSmile: "Bienvenue sur First Smile AI !",
    yourAIDentalAssistant: "Votre Assistant Dentaire IA",
    onboardingIntro:
      "Je suis la pour vous aider avec tous vos besoins dentaires, 24h/24.",
    smartFeaturesService: "Fonctionnalites Intelligentes a Votre Service",
    aiChat: "Chat IA",
    aiChatDesc: "Obtenez des reponses instantanees",
    photoAnalysis: "Analyse Photo",
    photoAnalysisDesc: "Telechargez des photos pour une analyse IA",
    familyCare: "Soins Familiaux",
    familyCareDesc: "Reservez aussi pour les membres de la famille",
    letsStart: "Commençons !",
    next: "Suivant",
    back: "Retour",
    skip: "Passer",
    selectPreferredLanguage: "Selectionnez Votre Langue Preferee",
    languageSelectionDescription:
      "Choisissez votre langue pour commencer avec First Smile AI",
  },
  nl: {
    error: "Fout",
    success: "Succes",
    microphoneAccessError:
      "Kan geen toegang krijgen tot de microfoon. Controleer uw rechten.",
    transcriptionFailed:
      "Spraaktranscriptie mislukt. Probeer opnieuw of typ uw bericht.",
    voiceProcessingError:
      "Fout bij het verwerken van spraakbericht. Probeer opnieuw.",
    settings: "Instellingen",
    general: "Algemeen",
    theme: "Thema",
    personal: "Persoonlijk",
    language: "Voorkeurstaal",
    light: "Licht",
    dark: "Donker",
    save: "Opslaan",
    confirm: "Bevestigen",
    cancel: "Annuleren",
    close: "Sluiten",
    retry: "Opnieuw proberen",
    firstName: "Voornaam",
    lastName: "Achternaam",
    phoneNumber: "Telefoonnummer",
    dateOfBirth: "Geboortedatum",
    medicalHistory: "Medische voorgeschiedenis",
    personalInformation: "Persoonlijke informatie",
    savePersonalInfo: "Persoonlijke informatie opslaan",
    address: "Adres",
    emergencyContact: "Noodcontact",
    enterAddress: "Voer uw adres in",
    enterEmergencyContact: "Voer noodcontactinformatie in",
    languageUpdated: "Taal bijgewerkt",
    languageChangedTo: "Taal gewijzigd naar",
    themeUpdated: "Thema bijgewerkt",
    switchedToMode: "Overgeschakeld naar",
    personalInfoSaved: "Persoonlijke informatie opgeslagen",
    personalInfoUpdated: "Uw informatie is succesvol bijgewerkt.",
    informationConfirmed: "Informatie Bevestigd",
    changesSaved: "Wijzigingen Opgeslagen",
    privacyNotice:
      "Uw persoonlijke en medische gegevens zijn beschermd volgens ons privacybeleid.",
    signOut: "Uitloggen",
    signIn: "Inloggen",
    signUp: "Registreren",
    createAccount: "Account aanmaken",
    email: "E-mail",
    password: "Wachtwoord",
    phone: "Telefoon",
    optional: "optioneel",
    welcome: "Welkom",
    accessDentiBot: "Toegang tot DentiBot",
    signInOrCreate: "Log in of maak een account aan om te beginnen",
    signInButton: "Inloggen",
    createAccountButton: "Account aanmaken",
    accountCreatedSuccess: "Account succesvol aangemaakt!",
    checkEmailConfirm: "Controleer uw e-mail om uw account te bevestigen.",
    signUpError: "Registratiefout",
    signInError: "Inlogfout",
    signInSuccess: "Inloggen gelukt!",
    welcomeToDentiBot: "Welkom bij DentiBot.",
    continueWithGoogle: "Doorgaan met Google",
    or: "of",
    enterFirstName: "Voer uw voornaam in",
    enterLastName: "Voer uw achternaam in",
    enterPhoneNumber: "Voer uw telefoonnummer in",
    enterMedicalHistory:
      "Voer relevante medische voorgeschiedenis, allergieen, medicijnen, etc. in",
    selectLanguage: "Selecteer taal",
    enterEmail: "uw@email.com",
    enterPassword: "Voer uw wachtwoord in",
    dentalAssistant: "Tandheelkundige assistent",
    typeMessage: "Typ uw bericht...",
    send: "Versturen",
    welcomeMessage: "Hallo! Ik ben DentiBot. Hoe kan ik u vandaag helpen?",
    detailedWelcomeMessage: `Welkom bij First Smile AI!

Ik ben uw AI tandheelkundige assistent, 24/7 beschikbaar om u te helpen met:

- AI Chat - Krijg directe antwoorden op uw tandheelkundige vragen
- Slimme Boekingen - Boek afspraken intelligent
- Foto Analyse - Upload foto's voor AI-aangedreven tandheelkundige analyse
- Familiezorg - Boek afspraken voor uzelf of familieleden

Pro Tip: Vertel me gewoon wat u dwarszit!

Hoe kan ik u vandaag helpen?`,
    intelligentDentalAssistant: "Uw Intelligente Tandheelkundige Assistent 24/7",
    experienceFuture:
      "Ervaar de toekomst van tandheelkundige zorg met AI-consultaties en slimme afspraakplanning.",
    viewOurDentists: "Bekijk Onze Tandartsen",
    aiDiagnosis: "AI Diagnose",
    aiDiagnosisDesc: "Krijg direct AI-ondersteunde beoordelingen",
    smartBooking: "Slimme Boekingen",
    smartBookingDesc: "Boek afspraken intelligent",
    support24_7: "24/7 Ondersteuning",
    support24_7Desc: "Hulp rond de klok",
    initializingExperience: "Uw ervaring wordt geinitialiseerd",
    preparingAssistant:
      "Uw gepersonaliseerde tandheelkundige assistent wordt voorbereid met geavanceerde AI-technologie",
    chat: "Chat",
    appointments: "Afspraken",
    bookAppointment: "Afspraak Maken",
    bookConsultationDescription:
      "Boek uw tandheelkundige consultatie in slechts een paar tikken",
    chooseDentist: "Kies Tandarts",
    selectDate: "Selecteer Datum",
    selectTime: "Selecteer Tijd",
    availableSlots: "Beschikbare Tijdsloten",
    consultationReason: "Reden voor Consultatie",
    generalConsultation: "Algemene consultatie",
    routineCheckup: "Routine controle",
    dentalPain: "Tandpijn",
    emergency: "Spoed",
    cleaning: "Reiniging",
    other: "Anders",
    bookNow: "Nu Boeken",
    appointmentConfirmed: "Afspraak bevestigd!",
    errorTitle: "Fout",
    cannotLoadSlots: "Kan beschikbare tijdsloten niet laden",
    cannotLoadDentists: "Kan tandartslijst niet laden",
    missingInformation: "Ontbrekende informatie",
    selectDentistDateTime: "Selecteer een tandarts, datum en tijd",
    slotNoLongerAvailable: "Dit tijdslot is niet meer beschikbaar",
    cannotCreateAppointment: "Kan afspraak niet maken",
    myAppointments: "Mijn Afspraken",
    appointmentHistory: "Afsprakengeschiedenis",
    upcomingAppointments: "Komende Afspraken",
    pastAppointments: "Vorige Afspraken",
    newAppointment: "Nieuw",
    appointmentDetails: "Afspraak Details",
    loading: "Laden...",
    noUpcomingAppointments: "Geen komende afspraken",
    noPastAppointments: "Geen vorige afspraken",
    reschedule: "Herplannen",
    cancelAppointment: "Annuleren",
    confirmCancellation: "Afspraak Annuleren",
    confirmCancellationMessage:
      "Weet u zeker dat u deze afspraak wilt annuleren?",
    keepAppointment: "Afspraak Behouden",
    yesCancelAppointment: "Ja, Annuleren",
    appointmentCancelled: "Afspraak succesvol geannuleerd",
    failedToCancelAppointment: "Fout bij het annuleren van de afspraak",
    welcomeToFirstSmile: "Welkom bij First Smile AI!",
    yourAIDentalAssistant: "Uw AI Tandheelkundige Assistent",
    onboardingIntro:
      "Ik ben er om u te helpen met al uw tandheelkundige behoeften, 24/7.",
    smartFeaturesService: "Slimme Functies Tot Uw Dienst",
    aiChat: "AI Chat",
    aiChatDesc: "Krijg directe antwoorden op tandheelkundige vragen",
    photoAnalysis: "Foto Analyse",
    photoAnalysisDesc: "Upload foto's voor AI-analyse",
    familyCare: "Familiezorg",
    familyCareDesc: "Boek ook voor familieleden",
    letsStart: "Laten we Beginnen!",
    next: "Volgende",
    back: "Terug",
    skip: "Overslaan",
    selectPreferredLanguage: "Selecteer Uw Voorkeurstaal",
    languageSelectionDescription:
      "Kies uw taal om te beginnen met First Smile AI",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currentLanguage: string;
  changeLanguage: (lang: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const LANGUAGE_STORAGE_KEY = "preferred-language";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (
        savedLanguage &&
        ["en", "fr", "nl"].includes(savedLanguage as Language)
      ) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const changeLanguage = async (lang: Language) => {
    await setLanguage(lang);
  };

  const t = translations[language];

  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguage: language,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
