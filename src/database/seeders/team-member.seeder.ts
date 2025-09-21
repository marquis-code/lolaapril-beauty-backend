import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMember, TeamMemberDocument } from '../../teams/schemas/team-member.schema';

@Injectable()
export class TeamMemberSeeder {
  constructor(
    @InjectModel(TeamMember.name)
    private readonly teamMemberModel: Model<TeamMemberDocument>,
  ) {}

  async seed(): Promise<void> {
    try {
      // Check if data already exists
      const existingCount = await this.teamMemberModel.countDocuments();
      if (existingCount > 0) {
        console.log('TeamMembers already exist. Skipping seeding...');
        return;
      }

      const teamMembers = [
  {
  "name": "Gabriel Oke",
  "image": 'gabriel',
  "initials": "GO",
  "title": "Director and CEO",
  "position": 1,
  "profiles": [
    { "type": "LinkedIn", "url": "https://www.linkedin.com/in/gabrieloke/" },
    { "type": "ResearchGate", "url": "https://www.researchgate.net/profile/Gabriel-Oke/research" },
    { "type": "Google Scholar", "url": "https://scholar.google.com/citations?user=icNTymwAAAAJ&hl=en" },
    { "type": "ORCID", "url": "https://orcid.org/0000-0002-0890-8895" }
  ],
  "bio": "Gabriel Oke is a public health researcher who combines his passion for evidence-based research and global health equity to empower organizations in creating lasting, sustainable impact. He holds a Master of Science in Healthcare Management from the University of Global Health Equity in Rwanda and is currently pursuing an MBA at Chester Business School, UK.\n\nWith over six years of experience leading health initiatives, managing grant portfolios, and turning complex data into actionable strategies, Gabriel embodies OLGNova's mission to drive systemic change through innovation and collaboration.",
  "methods": [
    "Systematic Reviews & Meta-Analyses",
    "Mixed-Methods Research",
    "Cross-Sectional Surveys",
    "Policy Analysis"
  ],
  "publications": [
    {
      "title": "Prevalence of post‐caesarean section surgical site infections in Rwanda: A systematic review and meta‐analysis",
      "authors": "Sibomana, O., Bugenimana, A., Oke, G., & Ndayambaje, E.",
      "year": "2024",
      "journal": "International Wound Journal, 21",
      "doi": "10.1111/iwj.14929",
      "pubLink": "https://onlinelibrary.wiley.com/doi/10.1111/iwj.14929",
      "doiLink": "https://doi.org/10.1111/iwj.14929"
    },
    {
      "title": "Navigating the digital frontier during the COVID-19 pandemic and EVALI epidemic: The impact of social media on public health",
      "authors": "Ngoma, C., Matatiyo, A., Oke, G., Adebisi, Y., & Shomuyiwa, D.",
      "year": "2024",
      "journal": "Public Health Challenges, 3",
      "doi": "10.1002/puh2.173",
            "pubLink": "https://onlinelibrary.wiley.com/doi/abs/10.1002/puh2.173",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.1002/puh2.173"
    },
    {
      "title": "Experience of people living with leprosy at leprosy settlements in Nigeria",
      "authors": "Oke, G., Nsofor, I., Abubakar, B., Lucero‐Prisno, D., Sunday, A., Dibia, E., Okpokpo, O., Obeta, O. K., Babatunde, A., Adeyemi, A., Adeoye, P., & Utaka, E.",
      "year": "2024",
      "journal": "Public Health Challenges, 3",
      "doi": "10.1002/puh2.171",
            "pubLink": "https://www.authorea.com/users/774146/articles/868820-experience-of-people-living-with-leprosy-at-leprosy-settlements-in-nigeria",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.1002/puh2.171"
    },
    {
      "title": "Knowledge, perception, and willingness of emerging Public Health Advocates to effectively communicate about smoking cessation and Tobacco Harm Reduction in Africa",
      "authors": "Oke, G., Ademola, P., Utaka, E., John, E., Adam, M., Okereke, B., Onyia, I., & Adebisi, Y.",
      "year": "2024",
      "journal": "Discover Psychology, 4",
      "doi": "10.1007/s44202-023-00102-5",
            "pubLink": "https://link.springer.com/article/10.1007/s44202-023-00102-5",
      "doiLink": "https://doi.org/10.1007/s44202-023-00102-5"
    },
    {
      "title": "Portrayal of electronic cigarettes in the news",
      "authors": "Ngoma, C., Alhaj, S., Imo, U., Oke, G., & Adebisi, Y.",
      "year": "2023",
      "journal": "Public Health Challenges, 2",
      "doi": "10.1002/puh2.84",
            "pubLink": "https://onlinelibrary.wiley.com/doi/full/10.1002/puh2.84",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.1002/puh2.84"
    },
    {
      "title": "Knowledge, Attitude, And Practices (KAP) Of Malaria Prevention Amongst Medical Students of Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria",
      "authors": "Matthew, T., Komolafe, D. O., Nasir, A., Eleje, C., Obaji, P., Ekpenyong, M., Igharo, A., & Oke, G.",
      "year": "2022",
      "journal": "Razi International Medical Journal, 2, 28-40",
      "doi": "10.56101/rimj.v2i2.47",
            "pubLink": "https://rimj.org/pubs/index.php/journal/article/view/47",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.56101/rimj.v2i2.47"
    },
    {
      "title": "Understanding female condom use, acceptance, accessibility, awareness and knowledge among female public health students in a Nigerian university: A cross-sectional study",
      "authors": "Oke, G., Adebisi, Y., Olarewaju, O., Agboola, P., Ilesanmi, E., Micheal, A., Ahmadi, A., & III, D.",
      "year": "2021",
      "journal": "Razi International Medical Journal, 1",
      "doi": "10.56101/rimj.v1i2.16",
            "pubLink": "https://rimj.org/pubs/index.php/journal/article/view/16",
      "doiLink": "https://doi.org/10.56101/rimj.v1i2.16"
    },
    {
      "title": "Nigeria's Polio Elimination Playbook: Lessons To Strengthening Health Systems For Other Eradicable Diseases",
      "authors": "Effiong, F., Akanno, I., Anosike, U., Kayode, A., Okon, A., Dada, G., Oke, G., Nwobodo, M., & Uzairue, L.",
      "year": "2021",
      "journal": "Global Biosecurity, 3",
      "doi": "10.31646/gbio.127",
            "pubLink": "https://jglobalbiosecurity.com/index.php/up-j-gb/article/view/127",
      "doiLink": "https://doi.org/10.31646/gbio.127"
    },
    {
      "title": "Knowledge, Attitude, Practice and Predictors of Preventive Practices Toward COVID-19 among Healthcare Workers in Ogbomoso, Nigeria: A Cross-Sectional Study",
      "authors": "Adeoye, P., Oke, G., Fadele, K., & Awotunde, A.",
      "year": "2021",
      "journal": "Nigerian Journal of Medicine: Journal of the National Association of Resident Doctors of Nigeria, 30, 452",
      "doi": "10.4103/NJM.NJM_",
            "pubLink": "https://journals.lww.com/njom/fulltext/2021/30040/knowledge,_attitude,_practice_and_predictors_of.16.aspx",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.4103/NJM.NJM"
    },
    {
      "title": "COVID-19 calls for health systems strengthening in Africa: A case of Nigeria",
      "authors": "Oke, G., Adebisi, Y., & Nsofor, I.",
      "year": "2021",
      "journal": "International Journal of Health Planning and Management, 36, 1–9",
      "doi": "10.1002/hpm.3296",
            "pubLink": "https://pubmed.ncbi.nlm.nih.gov/34350637/",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.1002/hpm.3296"
    },
    {
      "title": "COVID-19 and Antimicrobial Resistance: A Review",
      "authors": "Adebisi, Y., Alaran, A., Okereke, M., Oke, G., Abimbola, A., Olaoye, O., Oladunjoye, I., Azeez, Y., Ukor, N., & III, D.",
      "year": "2021",
      "journal": "Infectious Diseases: Research and Treatment, 14, 1–9",
      "doi": "10.1177/11786337211033870",
            "pubLink": "https://pubmed.ncbi.nlm.nih.gov/34376994/",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.1177/11786337211033870"
    },
    {
      "title": "Transmission, entry and pattern of infection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2)",
      "authors": "Oke, G., Bassey, A., Fadele, K., Okereke, M., & Omoniyi, W.",
      "year": "2021",
      "journal": "Journal of Public Health and Diseases, 4, 330354–330355",
      "doi": "10.31248/JPHD2020.081",
          "pubLink": "https://www.researchgate.net/publication/351437205_Transmission_entry_and_pattern_of_infection_of_severe_acute_respiratory_syndrome_coronavirus_2_SARS-CoV-2#full-text",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.31248/JPHD2020.081"
    },
    {
      "title": "Impact of the COVID-19 Pandemic on Maternal and Child Health",
      "authors": "Oke, G., & Ihekweazu, V.",
      "year": "2020",
      "journal": "Modern Care Journal, 17, 110808",
      "doi": "10.5812/modernc.110808",
            "pubLink": "https://brieflands.com/articles/mcj-110808.html",
      "doiLink": "https://doi.org/10.5812/modernc.110808"
    },
    {
      "title": "Exploring the Knowledge, Attitude and Practice Regarding Hepatitis B Infection among Ogbomosho LGA Dwellers A Cross-Sectional Study",
      "authors": "Olaniyan, A., Oke, G., Folaranmi, P., & Adetunji, B.",
      "year": "2020",
      "journal": "Journal of Hepatology Research, 5(1), 1039",
      "doi": "",
            "pubLink": "http://researchgate.net/publication/347561451_Exploring_the_Knowledge_Attitude_and_Practice_Regarding_Hepatitis_B_Infection_among_Ogbomosho_LGA_Dwellers_A_Cross-Sectional_Study#full-text",
      "doiLink": ""
    },
    {
      "title": "Prospects of BNAbs in Management of HIV/AIDS",
      "authors": "Oke, G., Fadele, K., Adebisi, Y., Okereke, M., & Bassey, A.",
      "year": "2020",
      "journal": "International Journal of Health Research",
      "doi": "10.5812/ijhls.106098",
            "pubLink": "https://brieflands.com/articles/jhrt-106098",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.5812/ijhls.106098"
    },
    {
      "title": "COVID-19 in the Elderly and the Immunocompromised",
      "authors": "Oke, G., Fajobi, T., Akpan, S., & Adebisi, Y.",
      "year": "2020",
      "journal": "International Journal of Health Sciences",
      "doi": "10.5812/ijhls.105955",
            "pubLink": "https://brieflands.com/articles/jhrt-105955",
      "doiLink": "https://www.google.com/search?q=Oke,+Gabriel+%26+Fajobi,+Timothy+%26+Akpan,+Sarah+%26+Adebisi,+Yusuff+.+(2020).+COVID-19+in+the+Elderly+and+the+Immunocompromised.+International+journal+of+health+sciences.+10.5812/ijhls.105955."
    },
    {
      "title": "SARS-CoV-2 diagnostic testing in Africa: needs and challenges",
      "authors": "Adebisi, Y., Oke, G., Ademola, P., Dada, G., Ogunkola, I., & Lucero-Prisno, D.",
      "year": "2020",
      "journal": "Pan African Medical Journal, 35",
      "doi": "10.11604/pamj.supp.2020.35.2.22703",
            "pubLink": "https://www.researchgate.net/publication/341029877_SARS-CoV-2_diagnostic_testing_in_Africa_needs_and_challenges",
      "doiLink": "https://www.google.com/search?q=https://www.google.com/search%3Fq%3Dhttps://doi.org/10.11604/pamj.supp.2020.35.2.22703"
    }
  ]
},
{
  "image": 'olivier',
  "name": "Olivier Sibomana",
  "initials": "OS",
  "title": "Director of Research",
  "position": 5,
  "profiles": [
    { "type": "LinkedIn", "url": "https://www.linkedin.com/in/olivier-sibomana-253ab2207/" },
    { "type": "ResearchGate", "url": "https://www.researchgate.net/profile/Olivier-Sibomana" },
    { "type": "Google Scholar", "url": "https://scholar.google.com/citations?user=50FUWCoAAAAJ&hl=en" },
    { "type": "ORCID", "url": "https://orcid.org/0000-0003-2226-3883" }
  ],
  "bio": `
     Olivier Sibomana is a doctor of medicine with a burgeoning career as a researcher in public health, health technology, molecular medicine, and translational research. He has authored several peer-reviewed articles in reputable journals across these fields. In addition to his academic contributions, he possesses strong leadership and communication skills, and is well-versed in various research methodologies and data analytics, engaging in multidisciplinary research with both rigor and relevance.

     Sibomana also serves as a peer reviewer for several reputable journals published by leading academic publishers such as Elsevier, Wiley, MDPI, and the Public Library of Science (PLOS). He firmly believes that through research, existing gaps can be identified and meaningfully addressed—paving the way for creativity, innovation, and sustainable solutions.
  `,
  "methods": [
    "Diagnostic Accuracy Studies",
    "Scoping Reviews",
    "Retrospective Hospital-Based Studies",
    "Perspective/Policy Papers"
  ],
  "publications": [
    {
      "title": "Understanding Health Inequality, Disparity and Inequity in Africa: A Rapid Review of Concepts, Root Causes, and Strategic Solutions",
      "authors": "Oke, G., & Sibomana, O.",
      "year": "2025",
      "journal": "Public Health Challenges, 4",
      "doi": "10.1002/puh2.70040",
            "pubLink": "https://doi.org/10.1002/puh2.70040",
      "doiLink": "https://doi.org/10.1002/puh2.70040"
    },
    {
      "title": "Adoption of Digital Health Technology in Nigeria: A Scoping Review of Current Trends and Future Directions",
      "authors": "Oke, G., & Sibomana, O.",
      "year": "2025",
      "journal": "Advances in Public Health, 2025",
      "doi": "10.1155/adph/4246285",
            "pubLink": "https://doi.org/10.1155/adph/4246285",
      "doiLink": "https://doi.org/10.1155/adph/4246285"
    },
    {
      "title": "Diagnostic accuracy of ECG smart chest patches versus PPG smartwatches for atrial fibrillation detection: a systematic review and meta-analysis",
      "authors": "Sibomana, O., Hakayuwa, C. M., Gahire, H., Munyantore, J., & Chilala, M.",
      "year": "2025",
      "journal": "BMC Cardiovascular Disorders, 25, 132",
      "doi": "10.1186/s12872-025-04582-2",
            "pubLink": "https://doi.org/10.1186/s12872-025-04582-2",
      "doiLink": "https://doi.org/10.1186/s12872-025-04582-2"
    },
    {
      "title": "The Prevalence and Management of Aerodigestive Foreign Bodies at Rwanda Military Hospital: A Six-years Retrospective Study",
      "authors": "Bukuru, J., Ngirinshuti, A., Kamanda, P., Kananga, W., Mukomeza, C., & Sibomana, O.",
      "year": "2025",
      "journal": "Open Access Emergency Medicine, 17, 137-147",
      "doi": "10.2147/OAEM.S493458",
            "pubLink": "https://doi.org/10.2147/OAEM.S493458",
      "doiLink": "https://doi.org/10.2147/OAEM.S493458"
    },
    {
      "title": "Assessing the knowledge, attitudes, and perceptions toward smoking cessation among medical students in Rwanda",
      "authors": "Oke, G., Sibomana, O., Ainebyona, A., Utaka, E., & Adebisi, Y.",
      "year": "2025",
      "journal": "",
      "doi": "10.21203/rs.3.rs-5891044/v1",
            "pubLink": "https://doi.org/10.21203/rs.3.rs-5891044/v1",
      "doiLink": "https://doi.org/10.21203/rs.3.rs-5891044/v1"
    },
    {
      "title": "Routine malaria vaccination in Africa: a step toward malaria eradication?",
      "authors": "Sibomana, O., Bukuru, J., Saka, S., Mwangi, A., Oluwo, D., Bueh, L., Agbelemoge, B., & Oveh, R.",
      "year": "2025",
      "journal": "Malaria Journal, 24",
      "doi": "10.1186/s12936-024-05235-z",
            "pubLink": "https://doi.org/10.1186/s12936-024-05235-z",
      "doiLink": "https://doi.org/10.1186/s12936-024-05235-z"
    },
    {
      "title": "Knowledge, Attitude, and Practices of Antibiotic Usage and Resistance among People Attending Primary Healthcare in Rwanda",
      "authors": "Ndayisenga, J., Tuyishime, O., Sibomana, O., Kwizera, P., Niyompano, H., Hakizayezu, F., & Fitch, M.",
      "year": "2024",
      "journal": "Rwanda Journal of Medicine and Health Sciences, 7, 454-470",
      "doi": "10.4314/rjmhs.v7i3.7",
            "pubLink": "https://doi.org/10.4314/rjmhs.v7i3.7",
      "doiLink": "https://doi.org/10.4314/rjmhs.v7i3.7"
    },
    {
      "title": "Genetic Diversity Landscape in African Population: A Review of Implications for Personalized and Precision Medicine",
      "authors": "Sibomana, O.",
      "year": "2024",
      "journal": "Pharmacogenomics and Personalized Medicine, 17, 487-496",
      "doi": "10.2147/PGPM.S485452/",
            "pubLink": "https://doi.org/10.2147/PGPM.S485452",
      "doiLink": "https://doi.org/10.2147/PGPM.S485452"
    },
    {
      "title": "Could virtual reality be a solution in surgical trainings in resource-restricted settings? A perspective",
      "authors": "Sibomana, O.",
      "year": "2024",
      "journal": "Surgery Open Science, 21, 14-16",
      "doi": "10.1016/j.sopen.2024.08.004",
            "pubLink": "https://doi.org/10.1016/j.sopen.2024.08.004",
      "doiLink": "https://doi.org/10.1016/j.sopen.2024.08.004"
    },
    {
      "title": "Artificial intelligence in medicine: advantages and disadvantages for today and the future",
      "authors": "Salomon, I., & Sibomana, O.",
      "year": "2024",
      "journal": "International Journal of Surgery Open, 62",
      "doi": "10.1097/IO9.0000000000000133",
            "pubLink": "https://doi.org/10.1097/IO9.0000000000000133",
      "doiLink": "https://doi.org/10.1097/IO9.0000000000000133"
    },
    {
      "title": "Advancing Hepatitis C Elimination in Africa: Insights from Egypt",
      "authors": "Salomon, I., Sibomana, O., & Ndayambaje, E.",
      "year": "2024",
      "journal": "Hepatic Medicine Evidence and Research, 2024, 37-44",
      "doi": "10.2147/HMER.S470344",
            "pubLink": "https://doi.org/10.2147/HMER.S470344",
      "doiLink": "https://doi.org/10.2147/HMER.S470344"
    },
    {
      "title": "Prevalence of post‐caesarean section surgical site infections in Rwanda: A systematic review and meta‐analysis",
      "authors": "Sibomana, O., Bugenimana, A., Oke, G., & Ndayambaje, E.",
      "year": "2024",
      "journal": "International Wound Journal, 21",
      "doi": "10.1111/iwj.14929",
            "pubLink": "https://doi.org/10.1111/iwj.14929", 
      "doiLink": "https://doi.org/10.1111/iwj.14929"
    },
    {
      "title": "Advancing Hepatitis C Elimination in Africa: Insights from Egypt",
      "authors": "Salomon, I., & Sibomana, O.",
      "year": "2024",
      "journal": "",
      "doi": "10.20944/preprints202403.0935.v1",
            "pubLink": "https://doi.org/10.20944/preprints202403.0935.v1",
      "doiLink": "https://doi.org/10.20944/preprints202403.0935.v1"
    },
    {
      "title": "Addressing the evolving outbreak of Mpox disease in the Democratic Republic of Congo: Risk factors, challenges, and recommendations",
      "authors": "Sibomana, O., & Ndayambaje, E.",
      "year": "2024",
      "journal": "",
      "doi": "10.22541/au.171002795.59908317/v1",
            "pubLink": "https://doi.org/10.22541/au.171002795.59908317/v1",
      "doiLink": "https://doi.org/10.22541/au.171002795.59908317/v1"
    },
    {
      "title": "The meningitis outbreak returns to Niger: Concern, efforts, challenges and recommendations",
      "authors": "Sibomana, O., Hakayuwa, C., & Hakayuwa, C. M.",
      "year": "2024",
      "journal": "",
      "doi": "10.22541/au.170663699.98484836/v1",
            "pubLink": "https://www.google.com/search?q=https://doi.org/10.22541/au.170663699.98484836/v1",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.22541/au.170663699.98484836/v1"
    }
  ]
},
{
    name: 'Fadele Precious Kehinde',
    "image": 'precious',
    initials: 'FP',
    title: 'Head of Scientific Publications',
    position: 2, // Manager level
    profiles: [
      { type: 'LinkedIn', url: 'https://www.linkedin.com/in/fadele-kehinde-precious-b6728017a/' },
      { type: 'ResearchGate', url: 'https://www.researchgate.net/profile/Kehinde-Fadele' },
      { type: 'Google Scholar', url: 'https://scholar.google.com/citations?user=F4_klb4AAAAJ&hl=en' },
      { type: 'ORCID', url: 'https://orcid.org/0000-0002-0464-4167' }
    ],
    bio: `Kehinde Precious Fadele is an medical laboratory scientist from the University of Nigeria, Enugu State, with a remarkable record of early-career research. Her scholarly pursuits are rooted in neurosurgery, neuro-oncology, neuro-infections, neurology, and global and public health. Notably, she has authored and co-authored over 30 peer-reviewed publications, encompassing original research, literature reviews, commentaries, and case reports, in reputable international journals.
    <br><br>
    Precious serves as the Editor-in-Chief for Wiley journal in the United States and contributes as a reviewer for the Annals of Medicine and Surgery Journal (UK), where she has evaluated over 81 manuscripts.`,
    methods: [
      'Case Reports & Series',
      'Literature Reviews',
      'Editorials/Perspectives',
      'Survey Research'
    ],
    "publications": [
    {
      "title": "Revolutionizing aneurysm risk prediction: artificial intelligence's promise and challenges",
      "authors": "Okon, I., Fadele, K., Chaurasia, B., Mbong, E., John, O. O., Kankam, S., Akpan, U., & III, D.",
      "year": "2025",
      "journal": "Annals of Medicine and Surgery, 87",
      "doi": "10.1097/MS9.0000000000002917",
            "pubLink": "https://doi.org/10.1097/MS9.0000000000002917",
      "doiLink": "https://doi.org/10.1097/MS9.0000000000002917"
    },
    {
      "title": "Neurotrauma in sports: concussion and chronic traumatic encephalopathy (CTE)",
      "authors": "Fadele, K., Igwe, S., Egbo, K., Ernest, A., Somto, O., III, D., & Chaurasia, B.",
      "year": "2025",
      "journal": "Discover, 2",
      "doi": "10.1007/s44337-025-00206-y",
            "pubLink": "https://doi.org/10.1007/s44337-025-00206-y",
      "doiLink": "https://doi.org/10.1007/s44337-025-00206-y"
    },
    {
      "title": "December Editor's choice article \"The Evolving Role of Palliative Care in Older People with Glioblastoma\"",
      "authors": "Okon, I., Osama, M., Akpan, A., Paleare, L. F., Ferreira, M. Y., Shafqat, M. D., Razouqi, Y., James, E., Omer, M., Ja'afar, I., Chaurasia, B., Iqbal, M., Balogun, S., Maidan, A., Jakhar, M., Fadele, K., Gbayisomore, T., & III, D.",
      "year": "2024",
      "journal": "World Neurosurgery",
      "doi": "10.1016/S1878-8750(24)01857-6",
            "pubLink": "https://doi.org/10.1016/S1878-8750(24)01857-6",
      "doiLink": "https://doi.org/10.1016/S1878-8750(24)01857-6"
    },
    {
      "title": "Addressing Mental Health in Africa: Integrating Mental Health First Aid Initiatives",
      "authors": "Fadele, K., Ayuba, D., Igwe, S., Kolawole, E., Bianca, N., Owhor, G., Ogaya, J., & Lucero-Prisno, D. E.",
      "year": "2024",
      "journal": "",
      "doi": "10.22541/au.173217242.26089066/v1",
            "pubLink": "https://www.google.com/search?q=https://www.google.com/search%3Fq%3Dhttps://doi.org/10.22541/au.173217242.26089066/v1",
      "doiLink": "https://www.google.com/search?q=https://www.google.com/search%3Fq%3Dhttps://doi.org/10.22541/au.173217242.26089066/v1"
    },
    {
      "title": "The Current State of Spina Bifida in Low- and Middle-Income Countries: Where Does Africa Stand?",
      "authors": "Okon, I., Temitope, A., Ogundele, I., Akpan, U., Mbong, E., Kasimieh, O., Chaurasia, B., James, E., Gbadebo, E., Fadele, K., Jader, A., John, O. O., Karmani, V., Erhayanmen, M., & III, D.",
      "year": "2024",
      "journal": "Neurochirurgie, 71",
      "doi": "10.1016/j.neuchi.2024.101616",
            "pubLink": "https://doi.org/10.1016/j.neuchi.2024.101616",
      "doiLink": "https://doi.org/10.1016/j.neuchi.2024.101616"
    },
    {
      "title": "Exploring Immunotherapeutic Strategies For Bacterial And Viral Diseases: Recent Advances, Challenges And Future Perspectives",
      "authors": "Adedokun, A., Adigun, O., Muhammad Ibrahim, A., Idris, I., Ntasin, P. Y., Olowu, B., Ikele, C., & Fadele, K.",
      "year": "2024",
      "journal": "",
      "doi": "10.20944/preprints202411.0105.v1",
            "pubLink": "https://www.google.com/search?q=https://doi.org/10.20944/preprints202411.0105.v1",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.20944/preprints202411.0105.v1"
    },
    {
      "title": "Neurosurgical interventions in epilepsy management",
      "authors": "Fadele, K., Egbo, K., III, D., & Chaurasia, B.",
      "year": "2024",
      "journal": "Neurosurgical Review, 47",
      "doi": "10.1007/s10143-024-03036-1",
            "pubLink": "https://doi.org/10.1007/s10143-024-03036-1",
      "doiLink": "https://doi.org/10.1007/s10143-024-03036-1"
    },
    {
      "title": "The Evolving Role of Palliative Care in Older People with Glioblastoma",
      "authors": "Okon, I., Osama, M., Akpan, A., Paleare, L. F., Ferreira, M. Y., Shafqat, M. D., Razouqi, Y., James, E., Omer, M., Ja'afar, I., Chaurasia, B., Iqbal, M., Balogun, S., Maidan, A., Jakhar, M., Fadele, K., Gbayisomore, T., & Lucero-Prisno, D.",
      "year": "2024",
      "journal": "World Neurosurgery",
      "doi": "10.1016/j.wneu.2024.09.125",
            "pubLink": "https://doi.org/10.1016/j.wneu.2024.09.125",
      "doiLink": "https://doi.org/10.1016/j.wneu.2024.09.125"
    },
    {
      "title": "Obstacle to Neurosurgery residency: Research perspective in early age of career",
      "authors": "Fadele, K., & Chaurasia, B.",
      "year": "2024",
      "journal": "Neurosurgical Review, 47",
      "doi": "10.1007/s10143-024-02895-y",
            "pubLink": "https://doi.org/10.1007/s10143-024-02895-y",
      "doiLink": "https://doi.org/10.1007/s10143-024-02895-y"
    },
    {
      "title": "Reducing the burden of repeated ventriculo-peritoneal shunt surgery and infection in low and middle income country",
      "authors": "Fadele, K., & Chaurasia, B.",
      "year": "2024",
      "journal": "Neurosurgical Review, 47",
      "doi": "10.1007/s10143-024-02712-6",
            "pubLink": "https://doi.org/10.1007/s10143-024-02712-6",
      "doiLink": "https://doi.org/10.1007/s10143-024-02712-6"
    },
    {
      "title": "Influence of Social Media in Attracting Future Neurosurgeons to Neurosurgery",
      "authors": "Fadele, K., Marappan, K., & Chaurasia, B.",
      "year": "2024",
      "journal": "Annals of Medicine and Surgery, 86",
      "doi": "10.1097/MS9.0000000000002405",
            "pubLink": "https://doi.org/10.1097/MS9.0000000000002405",
      "doiLink": "https://doi.org/10.1097/MS9.0000000000002405"
    },
    {
      "title": "Strengthening neurosurgical training programs in Sub-saharan Africa: a medical student's perspective",
      "authors": "Okon, I., Akilimali, A., Chisvo, N., Al-Lami, B., Sebopelo, L., Gbayisomore, T., Masunga, D., Edet, E., John, O. O., Ewelike, S., III, D., Elijah Temitope, A., Nkansah-Poku, K., Bello, M., Fadele, K., & Erhayanmen, M.",
      "year": "2024",
      "journal": "Neurosurgical Review, 47",
      "doi": "10.1007/s10143-024-02469-y",
            "pubLink": "https://doi.org/10.1007/s10143-024-02469-y",
      "doiLink": "https://doi.org/10.1007/s10143-024-02469-y"
    },
    {
      "title": "Understanding the root of healing and beyond: Exploring the way forward for Alternative Medicine in Nigeria",
      "authors": "Ayuba, D., Fadele, K., Ogaya, J., Kolawole, E., Sharma, S., Lucero-Prisno, E., & Iii,.",
      "year": "2024",
      "journal": "Bhutan Sorig Journal, 1",
      "doi": "10.47811/bsj.0004050304",
            "pubLink": "https://doi.org/10.47811/bsj.0004050304",
      "doiLink": "https://doi.org/10.47811/bsj.0004050304"
    },
    {
      "title": "Global Neurosurgical Challenges: A Focus on Central Asia",
      "authors": "Okon, I., Akpan, U., III, D., Bankole, N., Shafqat, M. D., Rehman, I., Shafqat, M., Gbayisomore, T., Atallah, O., Maidan, A., Fadele, K., Musa, M., Ibrahim, M., Omer, M., Dzhusupov, K., Ermakhanfm, Z., Tygotov, T., Otaki, A., Toguzbaeva, K., & Chaurasia, B.",
      "year": "2024",
      "journal": "World Neurosurgery",
      "doi": "10.1016/j.wneu.2024.05.067",
            "pubLink": "https://doi.org/10.1016/j.wneu.2024.05.067",
      "doiLink": "https://doi.org/10.1016/j.wneu.2024.05.067"
    },
    {
      "title": "Mental health challenges in Nigeria: Bridging the gap between demand and resources",
      "authors": "Fadele, K., Igwe, S., Toluwalogo, N.-O., Udokang, E., Ogaya, J., & Lucero-Prisno, D.",
      "year": "2024",
      "journal": "Cambridge Prisms: Global Mental Health, 11",
      "doi": "10.1017/gmh.2024.19",
            "pubLink": "https://doi.org/10.1017/gmh.2024.19",
      "doiLink": "https://doi.org/10.1017/gmh.2024.19"
    }
  ]
  },
{
  "name": "Uzairue Leonard Ighodalo",
  "image": 'leonard',
  "initials": "UL",
  "title": "Director of Operations",
  "position": 3,
  "profiles": [
    { "type": "LinkedIn", "url": "https://www.linkedin.com/in/uzairueleonard/" },
    { "type": "ResearchGate", "url": "https://www.researchgate.net/profile/Leonard-Uzairue" },
    { "type": "Google Scholar", "url": "https://scholar.google.com/citations?user=HmF8kB0AAAAJ&hl=en" },
    { "type": "ORCID", "url": "https://orcid.org/0000-0003-2547-175X" }
  ],
  "bio": "Uzairue Leonard Ighodalo is a distinguished academic and researcher specializing in medical microbiology, antimicrobial resistance (AMR), and infectious disease epidemiology. With a PhD in Medical Microbiology and Public Health at the Federal University of Agriculture, Abeokuta, Leonard is a recipient of the prestigious NIHR & RSTMH grant for his groundbreaking research on COVID-19's impact on AMR in Nigeria.\n<br><br>\nLeonard's extensive research portfolio includes publications on Salmonella transmission dynamics, colistin resistance in Klebsiella pneumoniae, and surveillance systems for AMR in Africa.",
  "methods": [
    "Molecular Studies",
    "Systematic Reviews/Meta-Analyses",
    "Retrospective Cohort Studies",
    "Surveillance Data Analysis"
  ],
  "publications": [
    {
      "title": "Systematic Review Seroprevalence, Risk Factors and Maternal-Fetal Outcomes of Toxoplasma gondii in Pregnant Women from WHO Eastern Mediterranean Region: Systematic Review and Meta-Analysis",
      "authors": "Rabaan, A., Uzairue, L., Alfaraj, A., Halwani, M., Muzaheed, A., Alawfi, A., Alshengeti, A., Alkaabi, N., Alawad, E., Alhajri, M., Alwarthan, S., Alshukairi, A., Almuthree, S., Alsubki, R., Alshehri, N., Alissa, M., Albayat, H., Zaidan, T., Alagoul, H., & Alestad, J.",
      "year": "2023",
      "journal": "Pathogens, 12",
      "doi": "10.3390/pathogens12091157",
            "pubLink": "https://pubmed.ncbi.nlm.nih.gov/37764965/",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.3390/pathogens12091157"
    },
    {
      "title": "Detection of Multidrug resistant cariogenic bacteria among Diabetic Patients attending a Tertiary Hospital in Ado Ekiti, South-Western, Nigeria",
      "authors": "Adewumi, F., Adegoke, A., Ojerinde, O., Uzairue, L., Okiki, A., & Ibeh, I.",
      "year": "2023",
      "journal": "ABUAD International Journal of Natural and Applied Sciences, 3, 61–69",
      "doi": "10.53982/aijnas.2023.0302.09-j",
            "pubLink": "https://journals.abuad.edu.ng/index.php/aijnas/article/view/238",
      "doiLink": "https://doi.org/10.53982/aijnas.2023.0302.09-j"
    },
    {
      "title": "Antimicrobial resistance and virulence genes of invasive Salmonella enterica from children with bacteremia in north-central Nigeria",
      "authors": "Uzairue, L., Shittu, O., Ojo, O., Obuotor, T., Olanipekun, G., Ajose, T., Arogbonlo, R., Medugu, N., Ebruke, B., & Obaro, S.",
      "year": "2023",
      "journal": "SAGE Open Medicine, 11",
      "doi": "10.1177/20503121231175322",
            "pubLink": "https://pubmed.ncbi.nlm.nih.gov/37223673/",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.1177/20503121231175322"
    },
    {
      "title": "HIV Patients' Satisfaction with Pharmaceutical Care at a Nigerian Tertiary Healthcare Facility During the Covid-19 Pandemic",
      "authors": "Dalhatu Muhammad, A., Emmanuel, A., Ugwuonah, J., Okon, P., Aliyu, S., Uzairue, L., & Lucero-Prisno, D.",
      "year": "2023",
      "journal": "Journal of the International Association of Providers of AIDS Care, 22",
      "doi": "10.1177/23259582231159093",
            "pubLink": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9989440/",
      "doiLink": "https://www.google.com/search?q=https://www.google.com/search%3Fq%3Dhttps://doi.org/10.1177/23259582231159093"
    },
    {
      "title": "The potential impact of the COVID-19 pandemic on global antimicrobial and biocide resistance: an AMR Insights global perspective",
      "authors": "Hays, J., Kemp, A., Okechukwu, R., Murugaiyan, J., Ekwanzala, M., Alvarez, M., Paul Satyaseela, M., Iwu, C., Ballesté-Delpierre, C., Septimus, E., Mugisha, L., Fadare, J., Chaudhuri, S., Chibabhai, V., Rohini, J., Wadanamby, W., Daoud, Z., Xiao, Y., & Uzairue, L.",
      "year": "2023",
      "journal": "",
      "doi": "",
            "pubLink": "https://www.researchgate.net/publication/368463990_The_potential_impact_of_the_COVID-19_pandemic_on_global_antimicrobial_and_biocide_resistance_an_AMR_Insights_global_perspective#full-text",
      "doiLink": ""
    },
    {
      "title": "Salmonella enterica Transmission and Antimicrobial Resistance Dynamics across One-Health Sector",
      "authors": "Uzairue, L., & Shittu, O.",
      "year": "2023",
      "journal": "",
      "doi": "10.5772/intechopen.109229",
            "pubLink": "https://www.intechopen.com/chapters/85722",
      "doiLink": "https://doi.org/10.5772/intechopen.109229"
    },
    {
      "title": "COVID-19 Laboratory Testing Capacity in 13 African Countries",
      "authors": "Adebisi, Y., Rabe, A., Alaran, A., Babatunde, A., Uzairue, L., & Lucero, E.",
      "year": "2023",
      "journal": "5",
      "doi": "10.23880/EIJ-16000214",
            "pubLink": "https://medwinpublishers.com/EIJ/covid-19-laboratory-testing-capacity-in-13-african-countries.pdf",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.23880/EIJ-16000214"
    },
    {
      "title": "Systematic review of surveillance systems for AMR in Africa",
      "authors": "Okolie, O., Igwe, U., Ismail, S., Uzairue, L., & Adukwu, E.",
      "year": "2022",
      "journal": "Journal of Antimicrobial Chemotherapy, 78",
      "doi": "10.1093/jac/dkac342",
            "pubLink": "https://academic.oup.com/jac/article/78/1/31/6760343",
      "doiLink": "https://doi.org/10.1093/jac/dkac342"
    },
    {
      "title": "Global Prevalence of Colistin Resistance in Klebsiella pneumoniae from Bloodstream Infection: A Systematic Review and Meta-Analysis",
      "authors": "Uzairue, L., Rabaan, A., Adewumi, F., Okolie, O., Folorunso, J., Bakhrebah, M., Garout, M., Alfouzan, W., Halwani, M., Alamri, A., Halawani, S., Alshahrani, F., Hasan, A., Al Mutair, A., Alhumaid, S., Etafo, J., Utip, I., Odoh, I., & Uwaezuoke, N.",
      "year": "2022",
      "journal": "Pathogens, 11",
      "doi": "10.3390/pathogens11101092",
            "pubLink": "https://www.mdpi.com/2076-0817/11/10/1092",
      "doiLink": "https://www.google.com/search?q=https://www.google.com/search%3Fq%3Dhttps://doi.org/10.3390/pathogens11101092"
    },
    {
      "title": "Sex inequality in early initiation of breastfeeding in 24 sub-Saharan African countries: A multi-country analysis of Demographic and Health Surveys",
      "authors": "Bolarinwa, O., Ahinkorah, B., Arthur-Holmes, F., Aboagye, R., Ameyaw, E., Budu, E., Seidu, A.-A., Uzairue, L., & Yaya, S.",
      "year": "2022",
      "journal": "PLOS ONE, 17, 1–14",
      "doi": "10.1371/journal.pone.0267703",
            "pubLink": "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0267703",
      "doiLink": "https://doi.org/10.1371/journal.pone.0267703"
    },
    {
      "title": "Antimicrobial resistance and virulence genes in Salmonella enterica serovars isolated from droppings of layer chicken in two farms in Nigeria",
      "authors": "Shittu, O., Uzairue, L., Ojo, O., Obuotor, T., Folorunso, J., Raheem‐Ademola, R., Olanipekun, G., Ajose, T., Medugu, N., Ebruke, B., & Obaro, S.",
      "year": "2022",
      "journal": "Journal of Applied Microbiology, 132",
      "doi": "10.1111/jam.15477",
            "pubLink": "https://ami-journals.onlinelibrary.wiley.com/doi/full/10.1111/jam.15477",
      "doiLink": "https://doi.org/10.1111/jam.15477"
    },
    {
      "title": "Nigeria's Polio Elimination Playbook: Lessons To Strengthening Health Systems For Other Eradicable Diseases",
      "authors": "Effiong, F., Akanno, I., Anosike, U., Kayode, A., Okon, A., Dada, G., Oke, G., Nwobodo, M., & Uzairue, L.",
      "year": "2021",
      "journal": "Global Biosecurity, 3",
      "doi": "10.31646/gbio.127",
            "pubLink": "https://jglobalbiosecurity.com/index.php/up-j-gb/article/view/127",
      "doiLink": "https://doi.org/10.31646/gbio.127"
    },
    {
      "title": "Prevalence, risk factors and impact of cellular immunity on intestinal parasitosis among people living with HIV at Auchi, Edo State, Nigeria",
      "authors": "Uzairue, L., Ogbena, M., Ikede, R., Aguda, O., Adebisi, Y., & Lucero-Prisno, D.",
      "year": "2021",
      "journal": "International Journal of STD & AIDS, 32",
      "doi": "10.1177/09564624211020984",
            "pubLink": "https://journals.sagepub.com/doi/abs/10.1177/09564624211020984",
      "doiLink": "https://www.google.com/search?q=https://www.google.com/search%3Fq%3Dhttps://doi.org/10.1177/09564624211020984"
    },
    {
      "title": "The interplay between environmental factors, Vector Competence and vaccine immunodynamics as possible explanation of the 2019 Yellow fever Re-emergence in Nigeria",
      "authors": "Abdullahi, I., Abubakar, A., Emeribe, A., Umar, K., Adekola, H., Uzairue, L., Ghmaba, P., & Okwume, C.",
      "year": "2021",
      "journal": "New Microbes and New Infections, 41",
      "doi": "",
            "pubLink": "https://www.sciencedirect.com/science/article/pii/S2052297521000226",
      "doiLink": ""
    },
    {
      "title": "Humoral immunological kinetics of severe acute respiratory syndrome coronavirus 2 infection and diagnostic performance of serological assays for coronavirus disease 2019: an analysis of global reports",
      "authors": "Emeribe, A., Abdullahi, I. N., Shuwa, H., Uzairue, L., Musa, S., Abubakar, A., Adekola, H., Bello, Z. M., Aliyu, D., Haruna, S., Usman, Y., Muhammad, Y., Gwarzo, A., Nwofe, J., Chiwar, H., Okwume, C., Sunday, A., Fasogbon, S., Olayemi, L., & Rogo, L.",
      "year": "2021",
      "journal": "International Health, 13, 1–35",
      "doi": "10.1093/inthealth/ihab005",
            "pubLink": "https://academic.oup.com/inthealth/article/14/1/18/6147255",
      "doiLink": "https://doi.org/10.1093/inthealth/ihab005"
    },
    {
      "title": "Sero-survey of measles virus antibodies among symptomatic children attending Abuja Teaching Hospital, Nigeria",
      "authors": "Adekola, H., Abdullahi, I. N., Emeribe, A., Nafiu, F., Uzairue, L., Billyrose, O., & Shuwa, H.",
      "year": "2021",
      "journal": "16",
      "doi": "",
            "pubLink": "https://pubmed.ncbi.nlm.nih.gov/33643771/",
      "doiLink": ""
    },
    {
      "title": "Clinical characteristics of 4499 COVID-19 patients in Africa: A meta-analysis",
      "authors": "Olumade, T., & Uzairue, L.",
      "year": "2021",
      "journal": "Journal of Medical Virology, 93",
      "doi": "10.1002/jmv.26848",
            "pubLink": "https://pubmed.ncbi.nlm.nih.gov/33543800/",
      "doiLink": "https://doi.org/10.1002/jmv.26848"
    },
    {
      "title": "Ensuring Access to COVID-19 Vaccine among the Marginalized Populations in Africa",
      "authors": "Lucero-Prisno, D., Adebisi, Y., Uzairue, L., Yinka, A., Alaran, A., Izukanne, E., Jamgbadi, O., & Bolarinwa, O.",
      "year": "2021",
      "journal": "Public Health, 197",
      "doi": "10.1016/j.puhe.2021.01.008",
            "pubLink": "https://pubmed.ncbi.nlm.nih.gov/33632529/", 
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.1016/j.puhe.2021.01.008"
    },
    {
      "title": "Clinical characteristics of 4490 COVID-19 patients in Africa: A meta-analysis",
      "authors": "Olumade, T., & Uzairue, L.",
      "year": "2020",
      "journal": "",
      "doi": "10.1101/2020.10.20.20215905",
            "pubLink": "https://www.medrxiv.org/content/10.1101/2020.10.20.20215905v1",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.1101/2020.10.20.20215905"
    },
    {
      "title": "The Interplay Between Epigenetics, Vector Competence and Vaccine Immunodynamics as a Possible Explanation for Recent Yellow Fever Resurgence in Nigeria Summary BACKGROUND",
      "authors": "Umar, K., Abubakar, A., Nasir, I., Emeribe, A., Babayo, A., Adekola, H., Mukhtar Danmusa, U., & Uzairue, L.",
      "year": "2020",
      "journal": "African Journal of Health Sciences, 32, 38-52",
      "doi": "",
            "pubLink": "https://www.ajol.info/index.php/ajhs/article/view/199462",
      "doiLink": ""
    },
    {
      "title": "The Interplay Between Epigenetics, Vector Competence, and Vaccine Immunodynamics as a Possible Explanation for Recent Yellow Fever Resurgence in Nigeria",
      "authors": "Umar, K., Abubakar, A., Abdullahi, I. N., Emeribe, A., Babayo, A., Adekola, H., Mukhtar Danmusa, U., & Uzairue, L.",
      "year": "2020",
      "journal": "African Journal of Health Sciences, 32, 38–52",
      "doi": "",
            "pubLink": "https://www.ajol.info/index.php/ajhs/article/view/199462",
      "doiLink": ""
    },
    {
      "title": "Transcriptomic dysregulations associated with SARS-CoV-2 infection in human nasopharyngeal and peripheral blood mononuclear cells",
      "authors": "Vilas Boas de Melo, C., Bhuiyan, M., Gatua, W., Kanyerezi, S., Uzairue, L., Abechi, P., Kumar, K., Rahmat, J., Giwa, A., Mwandira, G., Abisogun, M., George, E., Oluwapelumi, J., Ibironke, A., Olayemi, D., Rotimi, A., Aly, D., Abo-Elenein, M., Abubakar, R., & Carl, S.",
      "year": "2020",
      "journal": "",
      "doi": "10.1101/2020.09.09.289850",
            "pubLink": "https://www.biorxiv.org/content/10.1101/2020.09.09.289850v1.full-text",
      "doiLink": "https://www.google.com/search?q=https://www.google.com/search%3Fq%3Dhttps://doi.org/10.1101/2020.09.09.289850"
    },
    {
      "title": "Tracking the epidemiology of epidemic meningitis in Nigeria, initial findings in the 2018 epidemic",
      "authors": "Medugu, N., Olanipekun, G., Okorie, C., Uzairue, L., Maishanu, S., Dogondaaj, A., Haliru Tambuwal, S., Ajose, T., Idiong, D., Ebruke, B., Haidar, N., Ojeifor, R., & Obaro, S.",
      "year": "2018",
      "journal": "",
      "doi": "",
            "pubLink": "https://www.researchgate.net/publication/335791215_Tracking_the_epidemiology_of_epidemic_meningitis_in_Nigeria_initial_findings_in_the_2018_epidemic",
      "doiLink": ""
    },
    {
      "title": "IMPACT OF GLOBALIZATION ON INFECTIOUS DISEASES AMONG FEMALES IN NIGERIA (Presented at WORDOC (Institute of Africa Studies)",
      "authors": "Uzairue, L., & Adewale, B.",
      "year": "2018",
      "journal": "",
      "doi": "",
            "pubLink": "https://www.researchgate.net/publication/323855064_IMPACT_OF_GLOBALIZATION_ON_INFECTIOUS_DISEASES_AMONG_FEMALES_IN_NIGERIA_Presented_at_WORDOC_Institute_of_Africa_Studies",
      "doiLink": ""
    },
    {
      "title": "Prophylactic Activity and Haematological Changes in Swiss Albino Rats Treated with Diodia scandens and Phyllanthus amarus Crude Extracts",
      "authors": "Ojo, K. S., Adeoye, A., & Uzairue, L.",
      "year": "2018",
      "journal": "",
      "doi": "",
            "pubLink": "https://www.researchgate.net/publication/323855318_Prophylactic_Activity_and_Haematological_Changes_in_Swiss_Albino_Rats_Treated_with_Diodia_scandens_and_Phyllanthus_amarus_Crude_Extracts",
      "doiLink": ""
    },
    {
      "title": "Emerging Antibiotic Resistant Nosocomial Infection – Coagulase Negative Staphylococci Isolated From Patients in General Hospitals Within Suburban Areas of Delta State, Nigeria",
      "authors": "Ojo, K. S., Esumeh, F. I., Osanyinlusi, S. A., Ojerinde, O., & Uzairue, L.",
      "year": "2017",
      "journal": "Nigerian Journal of Microbiology, 37, 3676-3688",
      "doi": "",
            "pubLink": "https://www.researchgate.net/publication/319402391_Emerging_Antibiotic_Resistant_Nosocomial_Infection_-_Coagulase_Negative_Staphylococci_Isolated_From_Patients_in_General_Hospitals_Within_Suburban_Areas_of_Delta_State_Nigeria",
      "doiLink": ""
    },
    {
      "title": "Determination of Human Parasitic Infestation on Fruits and Vegetables Sold in Ekpoma Markets, Edo State, Nigeria",
      "authors": "Okpala, H. O., Uzairue, L., Akhile, A., Aghatise, K., & Digban, K.",
      "year": "2016",
      "journal": "Asian Journal of Medical Sciences, 8, 10-14",
      "doi": "10.19026/ajms.8.2987",
            "pubLink": "https://www.researchgate.net/publication/309399561_Determination_of_Human_Parasitic_Infestation_on_Fruits_and_Vegetables_Sold_in_Ekpoma_Markets_Edo_State_Nigeria",
      "doiLink": "https://doi.org/10.19026/ajms.8.2987"
    },
    {
      "title": "Comparative Study of Research Publication among Professionals in Nigeria: A Study of Engineers and Medical Laboratory Scientists in Edo Central, Edo State, Nigeria",
      "authors": "Uzairue, L.",
      "year": "2014",
      "journal": "Early Years: An International Journal of Research and Development, 3, 247-250",
      "doi": "",
            "pubLink": "https://www.researchgate.net/publication/318404745_Comparative_Study_of_Research_Publication_among_Professionals_in_Nigeria_A_Study_of_Engineers_and_Medical_Laboratory_Scientists_in_Edo_Central_Edo_State_Nigeria",
      "doiLink": ""
    },
    {
      "title": "THE RELEVANCE OF INFORMATION AND COMMUNICATION TECHNOLOGIES IN LIBRARIES SERVICES AND LIBRARIANSHIP PROFESSION IN THE 21TH CENTURY",
      "authors": "Osawele, R.E., & Uzairue, L.I.",
      "year": "2013",
      "journal": "International Journal of Basic, Applied and Innovative Research, 2, 10-14",
      "doi": "",
            "pubLink": "https://www.semanticscholar.org/paper/The-Relevance-of-Information-and-Communication-in-Osawele-Uzairue/8c92d7613750e787135a3e1aebed60111719f32c",
      "doiLink": ""
    },
    {
      "title": "GASTRODISCOIDES HOMINIS INFESTATION ON VEGETABLES (CABBAGES) SOLD IN EKPOMA MARKETS, EDO STATE, SOUTHERN NIGERIA- A CASE REPORT",
      "authors": "Uzairue, Leonard",
      "year": "2013",
      "journal": "International Journal of Basic, Applied and Innovative Research, 2, 37-39",
      "doi": "",
            "pubLink": "https://www.researchgate.net/publication/320064592_GASTRODISCOIDES_HOMINIS_INFESTATION_ON_VEGETABLES_CABBAGES_SOLD_IN_EKPOMA_MARKETS_EDO_STATE_SOUTHERN_NIGERIA-_A_CASE_REPORT",
      "doiLink": ""
    }
  ]
},
  {
    name: 'Sherifat Oriza',
    "image": 'sherifat',
    initials: 'SO',
    title: 'Director of Communications',
    position: 4, // Director level
    profiles: [
      { type: 'LinkedIn', url: 'https://www.linkedin.com/in/sherifat-oriza/' }
    ],
    bio: `Sherifat Oriza is a Communications expert and dedicated Medical Laboratory Scientist, a graduate of Kwara State University, Malete, who seamlessly blends her scientific expertise with a passion for impactful communication. Initially torn between her love for life-saving science and the art of communication, she discovered the powerful intersection of these fields in health communications.
    <br><br>
    Her interests extend beyond the lab, encompassing global health, with a focus on research into infectious diseases and antimicrobial resistance, alongside molecular biology, health system strengthening, and infection prevention and control (IPC).`,
    methods: [],
    publications: []
  },
  {
  "name": "Esther Bassey",
  "image": 'esther',
  "initials": "EB",
  "title": "Research and Knowledge Dissemination Manager",
  "position": 6,
  "profiles": [
    { "type": "LinkedIn", "url": "https://www.linkedin.com/in/esther-bassey-31000a192/" },
    { "type": "ResearchGate", "url": "https://www.researchgate.net/profile/Esther-Bassey-9" },
    { "type": "Google Scholar", "url": "https://scholar.google.com/citations?user=H-lvDnsAAAAJ&hl=en" },
    { "type": "ORCID", "url": "https://orcid.org/0000-0001-9221-2219" }
  ],
  "bio": "Esther Bassey is an aspiring neuroscientist with interests in neuropharmacology, neuropsychiatry, digital health, and public health. She holds a Bachelor of Science in Medical Physiology from the University of Uyo, Nigeria, and has co-authored over ten peer-reviewed publications, contributing to neuroscience and global health. As a student editor for the International Journal of Medical Students (IJMS) and a reviewer for international journals, she actively advances medical research. She has interned at the Donders Institute for Brain, Cognition, and Behaviour, Radboud University, Netherlands, further deepening her expertise in neurobiology.\n<br><br>\nEsther has earned recognition as a two-time finalist in the iPitch Competition (Portugal) and secured second place at the Young European Scientist (YES) Meeting's Breakthrough Competition by Novartis. Her work in mental health awareness and public health aligns with her commitment to Sustainable Development Goal 3 (Good Health and Well-being). She has also participated in the British Medical Journal (BMJ) Summer Work Experience and interned with the West African Institute of Public Health, reinforcing her dedication to medical research and advocacy.",
  "methods": [
    "Systematic Reviews",
    "Bibliometric Analyses",
    "Narrative Reviews",
    "Secondary Data Analysis",
    "Survey Research",
    "Epidemiological Studies"
  ],
  "publications": [
    {
      "title": "The role of membrane trafficking and retromer complex in Parkinson's and Alzheimer's disease",
      "authors": "Abdul-Rahman, T., Ghosh, S., Kalmanovich, J., Wireko, A. A., Zivcevska, M., Khalifa, S., Bassey, E., Ali, N., Ferreira, M., Umar, T. P., Garg, N., Nweze, V., Inturu, V., Abdelwahab, M., Kurian, S., Alexiou, A., Alfaleh, M., Alqurashi, T., & Ashraf, G.",
      "year": "2023",
      "journal": "Journal of Neuroscience Research, 102",
      "doi": "10.1002/jnr.25261",
      "pubLink": "https://pubmed.ncbi.nlm.nih.gov/38284858/",
      "doiLink": "https://doi.org/10.1002/jnr.25261",
    },
    {
      "title": "The current state, advancements and challenges of neurosurgical care in Rwanda - a short report",
      "authors": "Okon, I., Rehman, I., Oduoye, M., Akilimali, A., Byiringiro, E., Akpan, U., Bassey, E., Vérité Cyubahiro, Florence Umutoni, & Nkeshimana, M.",
      "year": "2024",
      "journal": "Neurosurgical Review, 47",
      "doi": "10.1007/s10143-024-02453-6",
               "pubLink": "https://pubmed.ncbi.nlm.nih.gov/38727790/",
      "doiLink": "https://doi.org/10.1007/s10143-024-02453-6"
    },
    {
      "title": "Awareness, Coverage, and Barriers to COVID-19 Vaccination Among Students in Nigeria",
      "authors": "Effiong, F., Hassan, I., Olawuyi, D., Prosper, C., Araoye, J., Bassey, E., Enwerem, K., & Adebisi, Y.",
      "year": "2023",
      "journal": "International Journal of Medical Students, S106",
      "doi": "10.5195/ijms.2023.2376",
            "pubLink": "https://ijms.info/IJMS/article/view/1908",
      "doiLink": "https://doi.org/10.5195/ijms.2023.2376"
    },
    {
      "title": "Utility of Machine learning in the Management of Normal Pressure Hydrocephalus (NPH): A Systematic Review",
      "authors": "Pahwa, B., Tayal, A., Shukla, A., Soni, U., Gupta, N., Bassey, E., & Sharma, M.",
      "year": "2023",
      "journal": "World Neurosurgery, 177",
      "doi": "10.1016/j.wneu.2023.06.080",
            "pubLink": "https://pubmed.ncbi.nlm.nih.gov/37356488/",
      "doiLink": "https://doi.org/10.1016/j.wneu.2023.06.080"
    },
    {
      "title": "Global Needs and Barriers for Medical Research Education: Initiatives to Solve the Physician-Scientist Shortage",
      "authors": "Schneider, M., Elsayid, A., Bassey, E., Găman, M.-A., Egan, C., Puyana, J., & Bonilla Escobar, F.",
      "year": "2023",
      "journal": "The International Journal of Medical Students, 11, 9-12",
      "doi": "10.5195/ijms.2023.2011",
            "pubLink": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10487191/",
      "doiLink": "https://doi.org/10.5195/ijms.2023.2011"
    },
    {
      "title": "Prospects of malaria vaccination in Nigeria: Anticipated challenges and lessons from previous vaccination campaigns",
      "authors": "Effiong, F., Makata, V., Bassey, E., Salachi, K., Sagide, M., Abdulameed, H., & Uwishema, O.",
      "year": "2022",
      "journal": "Annals of Medicine and Surgery",
      "doi": "10.1016/j.amsu.2022.104385",
            "pubLink": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9421322/",
      "doiLink": "https://doi.org/10.1016/j.amsu.2022.104385"
    },
    {
      "title": "COVID-19 and Poverty in South America: the Mental Health Implications",
      "authors": "Bassey, E., Gupta, A., Kapoor, A., & Bansal, A.",
      "year": "2022",
      "journal": "International Journal of Mental Health and Addiction, 21",
      "doi": "10.1007/s11469-022-00765-6",
            "pubLink": "https://psycnet.apa.org/record/2022-26872-001",
      "doiLink": "https://doi.org/10.1007/s11469-022-00765-6"
    },
    {
      "title": "Typhoid Fever and COVID-19 Pandemic in Nigeria: A Call for Coordinated Action",
      "authors": "Bassey, E., Hasan, M. M., dos Santos Costa, A. C., Τsagkaris, C., Aborode, A., Karra-Aly, A., Essar, M., & Ahmad, S.",
      "year": "2021",
      "journal": "Einstein (São Paulo)",
      "doi": "10.31744/einstein_journal/2021CE6796",
            "pubLink": "https://pubmed.ncbi.nlm.nih.gov/34932777/",
      "doiLink": "https://doi.org/10.31744/einstein_journal/2021CE6796"
    },
    {
      "title": "Malnutrition and the mental health of children: the sub-Saharan Africa perspective",
      "authors": "Bassey, E., dos Santos Costa, A. C., Adnan, A., Xenophontos, E., Phadke, R., Ahmed, S., Ahmad, S., Essar, M., & Yasmin, F.",
      "year": "2021",
      "journal": "Pan African Medical Journal",
      "doi": "10.11604/pamj-oh.2021.6.7.29586",
            "pubLink": "https://www.researchgate.net/publication/356857898_Malnutrition_and_the_mental_health_of_children_the_sub-Saharan_Africa_perspective",
      "doiLink": "https://doi.org/10.11604/pamj-oh.2021.6.7.29586"
    },
    {
      "title": "Floods, landslides and COVID-19 in the Uttarakhand State, India: Impact of Ongoing Crises on Public Health",
      "authors": "Corriero, A., Khan, F., Bassey, E., Bouaddi, O., dos Santos Costa, A. C., Outani, O., Ahmad, S., Essar, M., & Hasan, M. M.",
      "year": "2021",
      "journal": "Disaster Medicine and Public Health Preparedness",
      "doi": "10.1017/dmp.2021.373",
            "pubLink": "https://pubmed.ncbi.nlm.nih.gov/34937598/",
      "doiLink": "https://doi.org/10.1017/dmp.2021.373"
    },
    {
      "title": "Lassa Fever and COVID-19 in Africa: A double crisis on the fragile health system",
      "authors": "Hasan, M. M., dos Santos Costa, A. C., Xenophontos, E., Mohanan, P., Bassey, E., Ahmad, S., & Essar, M.",
      "year": "2021",
      "journal": "Journal of Medical Virology, 93",
      "doi": "10.1002/jmv.27169",
            "pubLink": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8427126/",
      "doiLink": "https://doi.org/10.1002/jmv.27169"
    },
    {
      "title": "Drug Supply Shortage in India during COVID-19 Pandemic: Efforts and Challenges",
      "authors": "Dapke, K., Phadke, R., Rocha, I. C., dos Santos Costa, A. C., Ahmad, S., Essar, M., Menon, V., Bassey, E., Malhotra, K., & Shah, J.",
      "year": "2021",
      "journal": "HPHR Journal, 31",
      "doi": "10.54111/0001/EE7",
            "pubLink": "https://bcphr.org/31-article-dapke/",
      "doiLink": "https://doi.org/10.54111/0001/EE7"
    },
    {
      "title": "Pandemic Preparedness Strategies with an Eye on Displaced Populations in Yemen: Efforts and Challenges on Hand",
      "authors": "Miranda, A., Mohan, A., dos Santos Costa, A. C., Hussaini, M., Adnan, A., Dapke, K., Phadke, R., Bassey, E., Ahmed, S., Essar, M., Ahmad, S., Τsagkaris, C., Aborode, A., & Hashim, H.",
      "year": "2021",
      "journal": "31",
      "doi": "10.54111/0001/EE12",
            "pubLink": "https://bcphr.org/31-article-miranda/",
      "doiLink": "https://doi.org/10.54111/0001/EE12"
    },
    {
      "title": "COVID-19 and its impacts: The situation in Niger republic",
      "authors": "Emmanuella, N., Udofa, E., Musa, S., Marc, M., David, S., Bassey, E., Essar, M., Adebisi, Y., & Lucero-Prisno, D.",
      "year": "2021",
      "journal": "Clinical Epidemiology and Global Health, 100797",
      "doi": "10.1016/j.cegh.2021.100797",
            "pubLink": "https://pubmed.ncbi.nlm.nih.gov/34095612/",
      "doiLink": "https://doi.org/10.1016/j.cegh.2021.100797"
    },
    {
      "title": "Climate change drives mass migration and threatens migrants' health: Is there a way out?",
      "authors": "Hasan, M. M., Ghosh, S., dos Santos Costa, A. C., Τsagkaris, C., Phadke, R., Bassey, E., Essar, M., Ahmad, S., & Shariful Islam, S. M.",
      "year": "2021",
      "journal": "Ethics, Medicine and Public Health, 18",
      "doi": "10.1016/j.jemep.2021.100671",
            "pubLink": "https://www.researchgate.net/publication/351363083_Climate_change_drives_mass_migration_and_threatens_migrants'_health_Is_there_a_way_out",
      "doiLink": "https://doi.org/10.1016/j.jemep.2021.100671"
    },
    {
      "title": "COVID‐19 and Zika: An emerging dilemma for Brazil",
      "authors": "dos Santos Costa, A. C., Hasan, M. M., Xenophontos, E., Mohanan, P., Bassey, E., Hashim, H., Ahmad, S., & Essar, M.",
      "year": "2021",
      "journal": "Journal of Medical Virology, 93",
      "doi": "10.1002/jmv.27006",
            "pubLink": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8251083/",
      "doiLink": "https://doi.org/10.1002/jmv.27006"
    }
  ]
},
{
  "name": "Obadiah Okpokpo",
  "image": 'obadiah',
  "initials": "OO",
  "title": "Data Analyst",
  "position": 7,
  "profiles": [
    { "type": "LinkedIn", "url": "https://www.linkedin.com/in/obadiah-okpokpo-6759a8162/" },
    { "type": "ResearchGate", "url": "https://www.researchgate.net/profile/Obadiah-Okpokpo" }
  ],
  "bio": "Obadiah Okpokpo is a biomedical scientist and data analyst with expertise in clinical diagnostics, data science, and business intelligence. With over five years of experience, he has worked across research, laboratory diagnostics, and analytical roles. Obadiah is skilled in data analysis using Python, R, and SAS, as well as database querying with MySQL, and business intelligence tools such as Tableau and Power BI. Currently a Research Associate at Innovision Consulting, he leverages his analytical skills to drive data-driven decision-making and strategic insights.<br><br>Obadiah has held key roles including Founder and Team Lead at AlphaTrack Intelligence and Laboratory Analyst at Omega Laboratories Abuja, where he applied his expertise in diagnostics and research. His experience also spans clinical programming at ClinFocus (USA) and data science internships at Innov8 Hub, Nigeria. A graduate of Ambrose Alli University, he holds certifications such as SAS Programming 1: Essentials and a Verified International Academic Qualification from WES. His work focuses on bridging biomedical research and data analytics, using technology to improve healthcare solutions.",
  "methods": [
    "Community-Based Cross-Sectional Studies",
    "Mixed-Methods Research (Qualitative & Quantitative)",
    "Survey Research"
  ],
  "publications": [
    {
      "title": "Experience of people living with leprosy at leprosy settlements in Nigeria",
      "pubLink": "https://www.authorea.com/users/774146/articles/868820-experience-of-people-living-with-leprosy-at-leprosy-settlements-in-nigeria",
      "authors": "Oke, G., Nsofor, I., Abubakar, B., Lucero‐Prisno, D., Sunday, A., Dibia, E., Okpokpo, O., Obeta, O. K., Babatunde, A., Adeyemi, A., Adeoye, P., & Utaka, E.",
      "year": "2024",
      "journal": "Public Health Challenges, 3",
      "doiLink": 'https://doi.org/10.1002/puh2.171',
      "doi": "10.1002/puh2.171"
    },
    {
      "title": "Effect of Antituberculosis Medication on Serum Concentrations of Zinc (Zn), Copper (Cu), and Manganese (Mn) in Tuberculosis Patients",
      "pubLink": "https://www.researchgate.net/publication/334828750_Effect_of_Antituberculosis_Medication_on_Serum_Concentrations_of_Zinc_Zn_Copper_Cu_and_Manganese_Mn_in_Tuberculosis_Patients",
      "authors": "Okogun, G., Dic-Ijiewere, E., Okpokpo, O., & Omolumen, L.",
      "year": "2019",
      "journal": "Recent Advances in Biology and Medicine, 5(1)",
      "doi": "10.18639/RABM.2019.869429",
      "doiLink": "https://www.google.com/search?q=https://doi.org/10.18639/RABM.2019.869429"
    }
  ]
},
{
  "name": "Melody Okerere",
  "image": 'melody',
  "initials": "MO",
  "title": "Research Consultant",
  "position": 7,
  "profiles": [
    { "type": "LinkedIn", "url": "https://www.linkedin.com/in/melodyokereke/" },
    { "type": "ResearchGate", "url": "https://scholar.google.com/citations?user=nSAC0zEAAAAJ&hl=en&oi=ao" },
    { "type": "Google Scholar", "url": "https://www.researchgate.net/profile/Melody-Okereke-2" },
    { "type": "ORCID", "url": "https://orcid.org/0000-0003-2533-6785" }
  ],
  "bio": `Melody Okereke is a distinguished youth leader and the Immediate Past (49th) National President of the Pharmaceutical Association of Nigeria Students (PANS), where he led over 40,000 students and implemented key reforms in welfare, leadership, and career growth.
.  With a pharmacy background and a mini-MBA from Tekedia Institute (USA), Melody is a strong advocate for youth engagement in governance and policy, working closely with political stakeholders and serving on advisory boards to pharmaceutical CEOs across Africa. In science, he has been recognized twice as a Top 2% Best Scientist in the World, with over 50 publications to his name.  He is a 2024 IAS Global Young Leader, 2023 Diana Award recipient, and a scholar at global conferences. Currently, he serves as a Youth Advisor on Governance, Peace, and Migration to the EU Delegation in Nigeria and ECOWAS.
`,
  "methods": [],
  "publications": []
}
];

    //   const teamMembersData = [
    //     {
    //       id: "gabriel-oke",
    //       name: "Gabriel Oke",
    //       image: "gabriel.jpg",
    //       initials: "GO",
    //       title: "Director and CEO",
    //       position: 1,
    //       profiles: [
    //         { type: "LinkedIn", url: "https://www.linkedin.com/in/gabrieloke/" },
    //         { type: "ResearchGate", url: "https://www.researchgate.net/profile/Gabriel-Oke/research" },
    //         { type: "Google Scholar", url: "https://scholar.google.com/citations?user=icNTymwAAAAJ&hl=en" },
    //         { type: "ORCID", url: "https://orcid.org/0000-0002-0890-8895" }
    //       ],
    //       bio: "Gabriel Oke is a public health researcher who combines his passion for evidence-based research and global health equity to empower organizations in creating lasting, sustainable impact. He holds a Master of Science in Healthcare Management from the University of Global Health Equity in Rwanda and is currently pursuing an MBA at Chester Business School, UK.\n\nWith over six years of experience leading health initiatives, managing grant portfolios, and turning complex data into actionable strategies, Gabriel embodies OLGNova's mission to drive systemic change through innovation and collaboration.",
    //       methods: [
    //         "Systematic Reviews & Meta-Analyses",
    //         "Mixed-Methods Research",
    //         "Cross-Sectional Surveys",
    //         "Policy Analysis"
    //       ],
    //       publications: [
    //         {
    //           title: "Prevalence of post‐caesarean section surgical site infections in Rwanda: A systematic review and meta‐analysis",
    //           authors: "Sibomana, O., Bugenimana, A., Oke, G., & Ndayambaje, E.",
    //           year: 2024,
    //           journal: "International Wound Journal, 21",
    //           doi: "10.1111/iwj.14929",
    //           pubLink: "https://onlinelibrary.wiley.com/doi/10.1111/iwj.14929",
    //           doiLink: "https://doi.org/10.1111/iwj.14929"
    //         },
    //         {
    //           title: "Navigating the digital frontier during the COVID-19 pandemic and EVALI epidemic: The impact of social media on public health",
    //           authors: "Ngoma, C., Matatiyo, A., Oke, G., Adebisi, Y., & Shomuyiwa, D.",
    //           year: 2024,
    //           journal: "Public Health Challenges, 3",
    //           doi: "10.1002/puh2.173",
    //           pubLink: "https://onlinelibrary.wiley.com/doi/abs/10.1002/puh2.173",
    //           doiLink: "https://www.google.com/search?q=https://doi.org/10.1002/puh2.173"
    //         }
    //       ]
    //     },
    //     {
    //       id: "sarah-johnson",
    //       name: "Dr. Sarah Johnson",
    //       image: "sarah-johnson.jpg",
    //       initials: "SJ",
    //       title: "Lead Research Scientist",
    //       position: 2,
    //       profiles: [
    //         { type: "LinkedIn", url: "https://www.linkedin.com/in/sarah-johnson-phd/" },
    //         { type: "ResearchGate", url: "https://www.researchgate.net/profile/Sarah-Johnson-PhD" },
    //         { type: "Google Scholar", url: "https://scholar.google.com/citations?user=abc123&hl=en" },
    //         { type: "ORCID", url: "https://orcid.org/0000-0003-1234-5678" }
    //       ],
    //       bio: "Dr. Sarah Johnson is a distinguished epidemiologist with over 12 years of experience in infectious disease research and global health surveillance. She holds a Ph.D. in Epidemiology from Harvard T.H. Chan School of Public Health and has led multiple international research collaborations across Africa and Asia.\n\nHer expertise spans disease modeling, outbreak investigation, and health systems strengthening. She has been instrumental in developing evidence-based interventions for malaria prevention and has published extensively in top-tier journals.",
    //       methods: [
    //         "Epidemiological Modeling",
    //         "Outbreak Investigation",
    //         "Longitudinal Studies",
    //         "Spatial Analysis"
    //       ],
    //       publications: [
    //         {
    //           title: "Machine Learning Approaches to Malaria Risk Prediction in Sub-Saharan Africa",
    //           authors: "Johnson, S., Adebayo, M., Chen, L., & Williams, K.",
    //           year: 2024,
    //           journal: "Nature Medicine, 30",
    //           doi: "10.1038/s41591-024-0000-1",
    //           pubLink: "https://nature.com/articles/s41591-024-0000-1",
    //           doiLink: "https://doi.org/10.1038/s41591-024-0000-1"
    //         },
    //         {
    //           title: "Impact of Climate Change on Vector-Borne Disease Transmission: A Systematic Review",
    //           authors: "Johnson, S., Thompson, R., & Martinez, A.",
    //           year: 2023,
    //           journal: "The Lancet Planetary Health, 7",
    //           doi: "10.1016/S2542-5196(23)00001-X",
    //           pubLink: "https://thelancet.com/journals/lanplh/article/PIIS2542-5196(23)00001-X",
    //           doiLink: "https://doi.org/10.1016/S2542-5196(23)00001-X"
    //         }
    //       ]
    //     },
    //     {
    //       id: "michael-chen",
    //       name: "Prof. Michael Chen",
    //       image: "michael-chen.jpg",
    //       initials: "MC",
    //       title: "Senior Data Analyst",
    //       position: 3,
    //       profiles: [
    //         { type: "LinkedIn", url: "https://www.linkedin.com/in/prof-michael-chen/" },
    //         { type: "ResearchGate", url: "https://www.researchgate.net/profile/Michael-Chen-Prof" },
    //         { type: "Google Scholar", url: "https://scholar.google.com/citations?user=xyz789&hl=en" },
    //         { type: "ORCID", url: "https://orcid.org/0000-0004-9876-5432" }
    //       ],
    //       bio: "Professor Michael Chen is a leading biostatistician and data scientist specializing in health informatics and precision medicine. He earned his Ph.D. in Biostatistics from Stanford University and has over 15 years of experience in developing statistical methods for clinical trials and population health studies.\n\nHis research focuses on the application of artificial intelligence and machine learning in healthcare, with particular emphasis on predictive modeling for chronic diseases and health outcomes optimization.",
    //       methods: [
    //         "Machine Learning",
    //         "Biostatistics",
    //         "Predictive Modeling",
    //         "Health Informatics"
    //       ],
    //       publications: [
    //         {
    //           title: "Deep Learning for Early Detection of Cardiovascular Disease: A Multi-Center Study",
    //           authors: "Chen, M., Liu, Y., Patel, R., & Singh, K.",
    //           year: 2024,
    //           journal: "Journal of the American Medical Association, 331",
    //           doi: "10.1001/jama.2024.0000",
    //           pubLink: "https://jamanetwork.com/journals/jama/fullarticle/0000000",
    //           doiLink: "https://doi.org/10.1001/jama.2024.0000"
    //         },
    //         {
    //           title: "Federated Learning for Privacy-Preserving Healthcare Analytics",
    //           authors: "Chen, M., Zhang, W., & Kumar, A.",
    //           year: 2023,
    //           journal: "Nature Digital Medicine, 6",
    //           doi: "10.1038/s41746-023-0000-0",
    //           pubLink: "https://nature.com/articles/s41746-023-0000-0",
    //           doiLink: "https://doi.org/10.1038/s41746-023-0000-0"
    //         }
    //       ]
    //     },
    //     {
    //       id: "aisha-mohammed",
    //       name: "Dr. Aisha Mohammed",
    //       image: "aisha-mohammed.jpg",
    //       initials: "AM",
    //       title: "Program Manager",
    //       position: 4,
    //       profiles: [
    //         { type: "LinkedIn", url: "https://www.linkedin.com/in/dr-aisha-mohammed/" },
    //         { type: "ResearchGate", url: "https://www.researchgate.net/profile/Aisha-Mohammed-Dr" },
    //         { type: "Google Scholar", url: "https://scholar.google.com/citations?user=def456&hl=en" },
    //         { type: "ORCID", url: "https://orcid.org/0000-0005-1111-2222" }
    //       ],
    //       bio: "Dr. Aisha Mohammed is a dedicated public health professional with extensive experience in program management and community health interventions. She holds an MD from the University of Lagos and an MPH from the London School of Hygiene and Tropical Medicine.\n\nWith over 10 years of field experience across West Africa, she specializes in maternal and child health programs, nutrition interventions, and health system strengthening. Her work has directly impacted over 500,000 individuals across rural and urban communities.",
    //       methods: [
    //         "Community-Based Research",
    //         "Program Evaluation",
    //         "Qualitative Methods",
    //         "Implementation Science"
    //       ],
    //       publications: [
    //         {
    //           title: "Effectiveness of Community Health Worker Programs in Reducing Maternal Mortality in Rural Nigeria",
    //           authors: "Mohammed, A., Okafor, C., Bello, S., & Adamu, H.",
    //           year: 2024,
    //           journal: "Global Health Action, 17",
    //           doi: "10.1080/16549716.2024.0000001",
    //           pubLink: "https://www.tandfonline.com/doi/full/10.1080/16549716.2024.0000001",
    //           doiLink: "https://doi.org/10.1080/16549716.2024.0000001"
    //         },
    //         {
    //           title: "Mobile Health Interventions for Improving Vaccination Coverage: A Randomized Controlled Trial",
    //           authors: "Mohammed, A., Ibrahim, M., & Yusuf, N.",
    //           year: 2023,
    //           journal: "BMC Public Health, 23",
    //           doi: "10.1186/s12889-023-0000-x",
    //           pubLink: "https://bmcpublichealth.biomedcentral.com/articles/10.1186/s12889-023-0000-x",
    //           doiLink: "https://doi.org/10.1186/s12889-023-0000-x"
    //         }
    //       ]
    //     },
    //     {
    //       id: "david-williams",
    //       name: "David Williams",
    //       image: "david-williams.jpg",
    //       initials: "DW",
    //       title: "Research Coordinator",
    //       position: 5,
    //       profiles: [
    //         { type: "LinkedIn", url: "https://www.linkedin.com/in/david-williams-research/" },
    //         { type: "ResearchGate", url: "https://www.researchgate.net/profile/David-Williams-Researcher" },
    //         { type: "Google Scholar", url: "https://scholar.google.com/citations?user=ghi789&hl=en" },
    //         { type: "ORCID", url: "https://orcid.org/0000-0006-3333-4444" }
    //       ],
    //       bio: "David Williams is an experienced research coordinator and project manager with a strong background in clinical research and data management. He holds a Master's in Public Health from Johns Hopkins Bloomberg School of Public Health and has coordinated over 25 multi-site research studies.\n\nHis expertise lies in research protocol development, regulatory compliance, and team coordination. He has been instrumental in ensuring the successful execution of complex research projects across diverse settings and populations.",
    //       methods: [
    //         "Clinical Trial Coordination",
    //         "Data Management",
    //         "Regulatory Compliance",
    //         "Quality Assurance"
    //       ],
    //       publications: [
    //         {
    //           title: "Best Practices for Multi-Site Clinical Trial Coordination in Low-Resource Settings",
    //           authors: "Williams, D., Brown, J., & Taylor, M.",
    //           year: 2024,
    //           journal: "Clinical Trials, 21",
    //           doi: "10.1177/17407745240000001",
    //           pubLink: "https://journals.sagepub.com/doi/10.1177/17407745240000001",
    //           doiLink: "https://doi.org/10.1177/17407745240000001"
    //         },
    //         {
    //           title: "Digital Data Collection Tools for Health Research: A Comparative Analysis",
    //           authors: "Williams, D., Garcia, L., & Patel, S.",
    //           year: 2023,
    //           journal: "Journal of Medical Internet Research, 25",
    //           doi: "10.2196/40000",
    //           pubLink: "https://www.jmir.org/2023/1/e40000",
    //           doiLink: "https://doi.org/10.2196/40000"
    //         }
    //       ]
    //     },
    //     {
    //       id: "fatima-al-zahra",
    //       name: "Dr. Fatima Al-Zahra",
    //       image: "fatima-al-zahra.jpg",
    //       initials: "FZ",
    //       title: "Health Policy Advisor",
    //       position: 6,
    //       profiles: [
    //         { type: "LinkedIn", url: "https://www.linkedin.com/in/dr-fatima-al-zahra/" },
    //         { type: "ResearchGate", url: "https://www.researchgate.net/profile/Fatima-Al-Zahra-Dr" },
    //         { type: "Google Scholar", url: "https://scholar.google.com/citations?user=jkl012&hl=en" },
    //         { type: "ORCID", url: "https://orcid.org/0000-0007-5555-6666" }
    //       ],
    //       bio: "Dr. Fatima Al-Zahra is a renowned health policy expert with extensive experience in health systems research and policy analysis. She holds a Ph.D. in Health Policy from Oxford University and has served as an advisor to multiple international organizations including WHO and UNICEF.\n\nHer research focuses on health equity, universal health coverage, and the intersection of politics and public health. She has contributed to policy reforms in over 15 countries and is a frequent speaker at global health conferences.",
    //       methods: [
    //         "Policy Analysis",
    //         "Health Systems Research",
    //         "Stakeholder Analysis",
    //         "Economic Evaluation"
    //       ],
    //       publications: [
    //         {
    //           title: "Universal Health Coverage Implementation: Lessons from Middle-Income Countries",
    //           authors: "Al-Zahra, F., Nakamura, K., & Osei, D.",
    //           year: 2024,
    //           journal: "Health Affairs, 43",
    //           doi: "10.1377/hlthaff.2024.00000",
    //           pubLink: "https://www.healthaffairs.org/doi/10.1377/hlthaff.2024.00000",
    //           doiLink: "https://doi.org/10.1377/hlthaff.2024.00000"
    //         },
    //         {
    //           title: "The Political Economy of Health Sector Reform in Sub-Saharan Africa",
    //           authors: "Al-Zahra, F., Smith, R., & Mwangi, P.",
    //           year: 2023,
    //           journal: "Social Science & Medicine, 320",
    //           doi: "10.1016/j.socscimed.2023.115000",
    //           pubLink: "https://www.sciencedirect.com/science/article/pii/S0277953623115000",
    //           doiLink: "https://doi.org/10.1016/j.socscimed.2023.115000"
    //         }
    //       ]
    //     },
    //     {
    //       id: "james-okoro",
    //       name: "James Okoro",
    //       image: "james-okoro.jpg",
    //       initials: "JO",
    //       title: "Field Research Associate",
    //       position: 7,
    //       profiles: [
    //         { type: "LinkedIn", url: "https://www.linkedin.com/in/james-okoro-research/" },
    //         { type: "ResearchGate", url: "https://www.researchgate.net/profile/James-Okoro-Field" },
    //         { type: "Google Scholar", url: "https://scholar.google.com/citations?user=mno345&hl=en" },
    //         { type: "ORCID", url: "https://orcid.org/0000-0008-7777-8888" }
    //       ],
    //       bio: "James Okoro is a dedicated field research associate with a passion for community engagement and grassroots health research. He holds a Bachelor's degree in Public Health from the University of Ibadan and has over 7 years of experience working directly with communities across Nigeria.\n\nHis expertise includes community mobilization, data collection, and participatory research methods. James has been involved in numerous studies focusing on infectious disease prevention, health behavior change, and community health worker training programs.",
    //       methods: [
    //         "Community Engagement",
    //         "Participatory Research",
    //         "Field Data Collection",
    //         "Behavioral Interventions"
    //       ],
    //       publications: [
    //         {
    //           title: "Community Perceptions of COVID-19 Vaccination in Rural Nigeria: A Qualitative Study",
    //           authors: "Okoro, J., Adebayo, T., Mohammed, K., & Eze, C.",
    //           year: 2023,
    //           journal: "Vaccine, 41",
    //           doi: "10.1016/j.vaccine.2023.00000",
    //           pubLink: "https://www.sciencedirect.com/science/article/pii/S0264410X23000000",
    //           doiLink: "https://doi.org/10.1016/j.vaccine.2023.00000"
    //         },
    //         {
    //           title: "Effectiveness of Peer Education Programs for HIV Prevention Among Youth in Nigeria",
    //           authors: "Okoro, J., Bello, A., & Usman, M.",
    //           year: 2022,
    //           journal: "AIDS Education and Prevention, 34",
    //           doi: "10.1521/aeap.2022.34.6.000",
    //           pubLink: "https://guilford.com/journals/AIDS-Education-and-Prevention/34/6/000",
    //           doiLink: "https://doi.org/10.1521/aeap.2022.34.6.000"
    //         }
    //       ]
    //     },
    //     {
    //       id: "linda-nakamura",
    //       name: "Dr. Linda Nakamura",
    //       image: "linda-nakamura.jpg",
    //       initials: "LN",
    //       title: "Biostatistician",
    //       position: 8,
    //       profiles: [
    //         { type: "LinkedIn", url: "https://www.linkedin.com/in/dr-linda-nakamura/" },
    //         { type: "ResearchGate", url: "https://www.researchgate.net/profile/Linda-Nakamura-Biostat" },
    //         { type: "Google Scholar", url: "https://scholar.google.com/citations?user=pqr678&hl=en" },
    //         { type: "ORCID", url: "https://orcid.org/0000-0009-9999-0000" }
    //       ],
    //       bio: "Dr. Linda Nakamura is a highly skilled biostatistician with expertise in advanced statistical methods and their application to public health research. She earned her Ph.D. in Statistics from UC Berkeley and has over 8 years of experience in designing and analyzing complex health studies.\n\nHer research interests include survival analysis, causal inference, and statistical methods for handling missing data. She has collaborated on numerous high-impact studies and has been recognized for her innovative approaches to statistical challenges in global health research.",
    //       methods: [
    //         "Survival Analysis",
    //         "Causal Inference",
    //         "Missing Data Methods",
    //         "Bayesian Statistics"
    //       ],
    //       publications: [
    //         {
    //           title: "Novel Statistical Methods for Analyzing Clustered Survival Data in Global Health Studies",
    //           authors: "Nakamura, L., Rodriguez, C., & Kim, S.",
    //           year: 2024,
    //           journal: "Statistics in Medicine, 43",
    //           doi: "10.1002/sim.0000",
    //           pubLink: "https://onlinelibrary.wiley.com/doi/10.1002/sim.0000",
    //           doiLink: "https://doi.org/10.1002/sim.0000"
    //         },
    //         {
    //           title: "Handling Missing Data in Longitudinal Health Studies: A Practical Guide",
    //           authors: "Nakamura, L., Thompson, B., & Lee, J.",
    //           year: 2023,
    //           journal: "American Journal of Epidemiology, 192",
    //           doi: "10.1093/aje/kwad000",
    //           pubLink: "https://academic.oup.com/aje/article/192/1/1/kwad000",
    //           doiLink: "https://doi.org/10.1093/aje/kwad000"
    //         }
    //       ]
    //     }
    //   ];

      // Insert all team members
      const createdMembers = await this.teamMemberModel.insertMany(teamMembers);
      console.log(`✅ ${createdMembers.length} TeamMembers seeded successfully:`);
      
      createdMembers.forEach((member, index) => {
        console.log(`   ${index + 1}. ${member.name} - ${member.title}`);
      });

    } catch (error) {
      console.error('❌ Error seeding TeamMember data:', error);
      throw error;
    }
  }
}