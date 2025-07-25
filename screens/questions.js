export default [
    { id: 'surveyor_name', type: 'question', text: 'Surveyor Name' },
    {
        id: 'district',
        type: 'question',
        text: 'District',
        question_type: 'dropdown',
        options: [
            'Belagavi',
            'Bidar',
            'Chikkaballapur',
            'Chitradurga',
            'Kalaburagi',
            'Mandya',
            'Shivamogga',
            'Udupi',
            'Uttara Kannada',
            'Vijayapura'
        ]
    },
    { id: 'taluka', type: 'question', text: 'Taluka', question_type: 'dropdown', options: ['Challekere', 'Hiriyur', 'Holalkere', 'Shikaripura', 'Shimoga', 'Hosanagara', 'Byandur', 'Udupi', 'K R Pet', 'Malvallai', 'Srirangapatna', 'Gauribidanur', 'Bagepalli', 'Gudibande', 'Basavakalyan', 'Humnabad', 'Chitaguppa', 'Aland', 'Afzalpur', 'Yadrami', 'Mundgod', 'Sirsi', 'Ankola', 'Indi', 'Bijapur', 'Kolhara', 'Athani', 'Raibagh', 'Illiterate'] },
    { id: 'village', type: 'question', text: 'Village' },
    { id: 'h1', type: 'heading', text: 'General Information of Respondent' },
    { id: '1', type: 'question', text: 'Name of the Farmer / Beneficiary' },
    { id: '2', type: 'question', text: 'Age in Years' },
    {
        id: '3',
        type: 'question',
        text: 'Gender',
        question_type: 'radio',
        options: ['Male', 'Female', 'Other'],
    },
    {
        id: '4',
        type: 'question',
        text: 'Category',
        question_type: 'radio',
        options: ['General', 'SC', 'ST'],
    },
    {
        id: '5',
        type: 'question',
        text: 'Highest Education Level',
        question_type: 'radio',
        options: ['Illiterate', 'Primary', 'Secoundary', 'PUC', 'Graduate', 'Post Graduate'],
    },
    { id: '6', type: 'question', text: 'Phone Number' },
    {
        id: '7',
        type: 'question',
        text: 'Landholding Size',
        question_type: 'radio',
        options: ['Marginal(<2.5 ac)', 'Small(<2.5-5 ac)', 'Semi-Medium(<5-10 ac)', 'Medium(10-25 ac)', 'Large(>25 ac)'],
    },
    {
        id: '8',
        type: 'question',
        text: 'Primary Occupation',
        question_type: 'radio',
        options: ['Agriculture', 'Agri-Labor', 'Bussiness', 'Other(Specify)'],
    },
    { id: '9', type: 'question', text: 'Secoundary Occupation (if any)' },
    { id: 'h2', type: 'heading', text: 'Landholding & Farming Practices' },
    { id: '10', type: 'question', text: 'Total Agricultural Land Owned (In Acre. Gunta)' },
    { id: '11', type: 'question', text: 'Irrigated Land (In Acre. Gunta)' },
    { id: '12', type: 'question', text: 'Non Irrigated Land (In Acre. Gunta)' },
    {
        id: '13',
        type: 'question',
        text: 'Source of Irrigation (tick applicable)',
        question_type: 'multi-select',
        options: ['Borewell', 'Open well', 'Canal', 'Krishi Honda'],
    },
    {
        id: '14',
        type: 'question',
        text: 'What is Borewell water Depth (feet)',
        question_type: 'radio',
        options: ['Yes', 'No'],
        subQuestions: {
            triggerValue: 'Yes',
            questions: [
                {
                    id: '14a',
                    text: 'feet',
                    question_type: 'text'
                }
            ]
        }
    },
    { id: 'h3', type: 'heading', text: 'Adoption & Usage of Micro-Irrigation (MI)' },
    {
        id: '15',
        type: 'question',
        text: 'Have you adopted micro irrigation? (Tick the appropriate option):',
        question_type: 'radio',
        options: ['Yes - Drip', 'Yes - Sprinkler', 'Yes - Both', 'Other(Specify)'],
        subQuestionsByValue: {
            'Yes - Drip': [
                {
                    id: '15a',
                    text: 'Type of Drip System Used',
                    question_type: 'multi-select',
                    options: ['Online', 'In-line', 'None']
                }
            ],
            'Yes - Sprinkler': [
                {
                    id: '15b',
                    text: 'Type of Sprinkler System Used',
                    question_type: 'multi-select',
                    options: ['Portable', 'Micro', 'Mini', 'Semi-permanent', 'Large Volume (Rain Gun)', 'None']
                }
            ],
            'Yes - Both': [
                {
                    id: '15c',
                    text: 'Type of Sprinkler System Used',
                    question_type: 'multi-select',
                    options: ['Online', 'In-line', 'Portable', 'Micro', 'Mini', 'Semi-permanent', 'Large Volume (Rain Gun)', 'None']
                }
            ]
        }
    },
    {
        id: '16',
        type: 'question',
        text: 'Have you taken government subsidy for setting up Micro Irrigation?',
        question_type: 'radio',
        options: ['Yes', 'No'],
    },
    {
        id: '17',
        type: 'question',
        text: 'Which year you submitted your application?',
        question_type: 'dropdown',
        options: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', 'None'],
    },
    {
        id: '18',
        type: 'question',
        text: ' Month & Year of Installation',
        question_type: 'dropdown',
        options: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', 'None'],
    },
    {
        id: '19',
        type: 'question',
        text: 'What among the below documents did you submit during MI subsidy application time? (Tick applicable)',
        question_type: 'multi-select',
        options: ['Aadhaar card',
            'Land ownership document / RTC', 'Bank passbook copy',
            'Mobile number (linked to Aadhaar)',
            'Caste certificate (if applicable)',
            'Income certificate (if applicable)',
            'Photograph (passport size)',
            'Water source ownership proof',
            'Water and Soil Analysis reports',
            'Cropping pattern details',
            'None']
    },
    { id: '20', type: 'question', text: 'Has water saving from MI helped you to expand your irrigated land? If yes, how much in acres' },
    // {
    //     id: '21',
    //     type: 'question',
    //     text: 'Which Crops were you growing before setting up MI.',
    //     question_type: 'radio',
    //     options: [
    //         'Cereals - Maize',
    //         'Cereals - Wheat',
    //         'Cereals - Rice',
    //         'Flowers - Rose',
    //         'Flowers - Chrysanthemum',
    //         'Flowers - Jasmine',
    //         'Flowers - Marigold',
    //         'Fruits',
    //         'Millets - Bajra',
    //         'Millets - Jowar',
    //         'Millets - Ragi',
    //         'Mulberry',
    //         'Oilseeds (Soybean, Sunflower, Groundnut, Sesamum)',
    //         'Plantation crop – Arecanut',
    //         'Plantation crop – Banana',
    //         'Plantation crop – Coconut',
    //         'Pulses - Red gram, Black gram, Green gram, Cowpea, Bengal gram',
    //         'Vegetables',
    //         'None'
    //     ],
    // },
        { id: '21', type: 'question', text: 'Which Crops were you growing before setting up MI.' },
    {
        id: '22',
        type: 'question',
        text: 'Is there any reduction in labour cost per acre after using the MI system?',
        question_type: 'radio',
        options: ['Yes', 'No'],
        subQuestions: {
            triggerValue: 'Yes',
            questions: [
                {
                    id: '22a',
                    text: 'Crop 1 Before MI ₹: ________ After MI ₹: ________',
                    question_type: 'text'
                },
                {
                    id: '22b',
                    text: 'Crop 2 Before MI ₹: ________ After MI ₹: ________',
                    question_type: 'text'
                }
            ]
        }
    },
    {
        id: '23',
        type: 'question',
        text: 'Has the Fertilizer cost per acre reduced after MI system use?',
        question_type: 'radio',
        options: ['Yes', 'No'],
        subQuestions: {
            triggerValue: 'Yes',
            questions: [
                {
                    id: '23a',
                    text: 'Crop 1 Before MI ₹: ________ After MI ₹: ________',
                    question_type: 'text'
                },
                {
                    id: '23b',
                    text: 'Crop 2 Before MI ₹: ________ After MI ₹: ________',
                    question_type: 'text'
                }
            ]
        }
    },
    {
        id: '24',
        type: 'question',
        text: 'Has the plant pesticide & weedicide cost per acre reduced after MI system use?',
        question_type: 'radio',
        options: ['Yes', 'No'],
        subQuestions: {
            triggerValue: 'Yes',
            questions: [
                {
                    id: '24a',
                    text: 'Crop 1 Before MI ₹: ________ After MI ₹: ________',
                    question_type: 'text'
                },
                {
                    id: '24b',
                    text: 'Crop 2 Before MI ₹: ________ After MI ₹: ________',
                    question_type: 'text'
                }
            ]
        }
    },
    {
        id: '25',
        type: 'question',
        text: 'Has the crop yield per acre increased after adopting the MI system?',
        question_type: 'radio',
        options: ['Yes', 'No'],
        subQuestions: {
            triggerValue: 'Yes',
            questions: [
                {
                    id: '25a',
                    text: 'Crop 1 Before MI ₹: ________ After MI ₹: ________',
                    question_type: 'text'
                },
                {
                    id: '25b',
                    text: 'Crop 2 Before MI ₹: ________ After MI ₹: ________',
                    question_type: 'text'
                }
            ]
        }
    },
    {
        id: '26',
        type: 'question',
        text: 'Has your income per acre increased after adopting the MI system?',
        question_type: 'radio',
        options: ['Yes', 'No'],
        subQuestions: {
            triggerValue: 'Yes',
            questions: [
                {
                    id: '26a',
                    text: 'Crop 1 Before MI ₹: ________ After MI ₹: ________',
                    question_type: 'text'
                },
                {
                    id: '26b',
                    text: 'Crop 2 Before MI ₹: ________ After MI ₹: ________',
                    question_type: 'text'
                }
            ]
        }
    },
    {
        id: '27',
        type: 'question',
        text: 'What was the reason for MI adpation? (Tick applicable)',
        question_type: 'multi-select',
        options: ['Advice from Department officials', 'Decline in water availability', 'Labour Scarcity, Less water scarcity', 'Promotion by MI suppliers', 'Subsidy support', 'To adopt new technology', 'To enhance crop production', 'To extend irrigated area', 'To save time in irrigation', 'Other(Specify)']
    },
    {
        id: '28',
        type: 'question',
        text: 'How did you come to know about the PMKSY-PDMC Scheme?',
        question_type: 'radio',
        options: ['Government Officials', 'MI Companies', 'Media', 'Farmer Groups', 'Other(Specify)'],
    },
    {
        id: '29',
        type: 'question',
        text: 'Who Installed the MI System?',
        question_type: 'dropdown',
        options: ['Govt Agency ', 'Private Vendor', 'MI Company', 'Self-installed'],
    },
    {
        id: '30',
        type: 'question',
        text: 'Name of the agency / vendor',
        question_type: 'dropdown',
        options: [
            'Shiva Irrigation Systems, Sy.No. 72/1A19, Near Sri channabasaveshwara Temple Gubbi',
            'Shiva Irrigation Systems, Sy.No. 72/1A19, Near Sri channabasaveshwara Temple Gubbikler',
            'Aaram Plastics Ltd, Sitapura Industrial Area, Tonk Road, Jaipur, Rajasthan',
            'AB Agropipes, Behind Krishna Talpatri Ring road No-2, Bhanpuri Raipur, Chhattisgarh, 492001',
            'ACP Agro Industries, Srno 59/1A/4, Near Salimani 02 Mudhol Mahalingpur Main Road, Mugalkhod, Bagalkote',
            'Aditya Irrigation Technologies Pvt Ltd, Kalikanagara, Andharalli Main Road, VN Post, Bangalore',
            'Agrifem Industries, Madyapradesh',
            'Agro Plast, Industrial estate, N.H.-206, Boonlihalli Gate,Tiptur-572201',
            'Agua Petals (India) Private Limited, Secunderabad',
            'Ambika Drip Irrigation, Behind santhe Gate, near Govt Bus stand Kolar',
            'Anant Irrigation (Dhanuka) AKVN Growth Center, Harsud Road, Rudhi Bhaw Singh Pura, Khandwa, Madhya Pradesh',
            'Anantha Biotechnology and Allied Ind Pvt Ltd, Opposite DPO, Ranagar Extension, Rudrampeta',
            'Apras Irrigation Systems Ltd, Nashik Mumbai Highway, Rajur Bahula Village, Nashik, Maharashtra',
            'Aqua Pipe Industries, Plot No. Spl.43/A1, Mundargi 2nd Stage Industrial Area, KSSIDC Ballari',
            'Astha Polymers Pvt Ltd, Plot 85 Industrial area,Medchal,R R district, Hyderbad',
            'Avyaan Irrigation Systems, Sy No 94/5, SSR Industrial Estate, Shed No 9, Kannalli Village Magadi Main Road, Bengaluru',
            'B K Industries, Survey NO 70/2, Chilwadgi Tanakankal ROAD, Chilwadgi, Chilwadgi, Koppal',
            'Balson Polyplast Pvt Ltd, Survey no 13 2 P1 Plot No 4 NH 27 Sadak Pipaliya Taluka Gondal, Rajkot,Gujarat-360311',
            'Bee-Gee Polymers, Near sub Jail, Kabbur Road, Kabbur Village, Haveri',
            'Bhavishya Irrigation work pvt ltd, sy no 230 2 2611 near tamota mandi , Anantapur,515004',
            'Bhima irrigations,Plot No.197/3, 1st Phase, Nandur Kesaratagi Industrial Area, Kalaburgi',
            'Bhumi Polymers Pvt. Ltd, S.R No 236 Plot No 34 35 Krishna Ind Area Verval Shapar Dist Rajkot',
            'BNS Irrigation Systems, NH 50, Vijayapur Main Road, Kushtagi 583277',
            'Bothara Agro Equipments Pvt Ltd, MIDC Industrial Area, Maharashtra',
            'C. J. Irrigations System, Brahmanipura (Thimmasandra Garden) Lalaghatta Post, Channapatna Tq, Ramanagara',
            'Captain Polyplast Ltd, Survey no 267 plot  10A 10B 11 NH 27 Shapar Rajkot 360024',
            'Cenmark Agronomics Pvt Ltd. CS6 P1, Sidco Industrial estate Kappalur, Madurai, 625008',
            'Chaitra Irrigations, No. 13, Next to BMTC Bus Depot, Challeghatta Village, Kengeri Hobli, Bengalore',
            'Chetan Vimal Pipes, No. 60/2b, Siddapura Village, Bangalore Road, Challakere',
            'Das Agroplast pvt Ltd, 363 RO muradi Hunagunda,Pune, Maharastra',
            'DKR Industries, Kerekondapura Village, Rampur, Molakalmuru Tq, Chitradurga',
            'Dolphin Irrigation system, 56/1, Kottigrpalya Magadi main road, Bengaluru',
            'Dolphin Polyplast Pvt Ltd, Tq, Lodhika Dist, Rajkot',
            'Drip India Irrigation Pvt Ltd, Pimpalnare phata, Nashik, Maharastra',
            'Euro Drip Irrigation System,Mysore road, Banglore',
            'Evergreen Irrigation, 293/1,50th Cross, 17th D Main, 3rd Block Rajajinagar, Bengaluru',
            'Farmtech International, 28A KIADB Ind area, B B Road, Chikkaballapura 562101',
            'Finolex Plasson Industries, No 103, 2nd stage Tarihal Industrial Area Near Pune Bangalore Highway',
            'Ganesh Irrigations, Laxmi Nagar, Mudalgi, Belagum',
            'Ganga Irrigations, plot No 233, KIADB nandur, Kesaratali, Ind area, Kalaburgi',
            'Global Electro Mechanical Equipments, Plot no 108, A B, IDP, Kadapa',
            'Golden Agro Industries, Sy No 453 Spl plot no 2 KSSIDC Rambag Ind Area, Jhamakhandi, Bagalkot',
            'Green Leaf Irrigation, HP Gas Lane Road, Belur Industrial area, Dharwad',
            'Green Royal, 28, Hanagawadi, Industrial Area, Harihara, Davanagere',
            'H G Polymers, plot no 62/A Kiadb Honga Ind area Honga, Belagavi',
            'Hanukripa Agro Industries, 56, Rawabhatha, Raipur',
            'Himadri Irrigation, No 81, 4th cross, Tigalarapalya main road, Karihobanahalli, Peenya, 2nd stage, Bengaluru',
            'IDOL Polytech Pvt Ltd, Rk Industrial Zone 8, At Ranpur, Wankaner Kuvadva Chowkdi',
            'Jain Irrigation Systems Ltd, 51/1, Osborne, road near Lavanya Theatre, Bengaluru',
            'Jaldhara Drip Irrigation Pvt Ltd, Plot No B-46, Musalgaon, Stice, Sinnar Tq, Nashik, Maharashtra, 422103',
            'Karan Agro Tech, Mathighatta Talya Hobli Holalkere, Chitradurga 577502',
            'Kaveri pipes, # 145, 3rd cross, Dollar Layout, Sarakki, JP Nagar 4th Phase, Bengaluru-78',
            'Khedut Irrigation (India) Pvt. Ltd. NH 27, Nr Bharudi Toll Plaza, Samrat Cement Compound, Ardoi, Rajkot, Gujarat',
            'Kisan Mouldings Ltd, opp Bharath petrol Kadabagere cross, Magadi main road Bangalore',
            'Kissan Irrigation & Infrastructures Pvt Ltd, Plot No 52 53 Pithampur Ind Area Sector 3 Sagore Kutti, Dhar, Madya pradesh',
            'Kothari Agritech Pvt Ltd, Subhash Chowk Murarji Peth 8516/11 3rd Floor Sun Plaza Solapur 413001',
            'Krishna sagar irrigations, sy no 20213 Hebbal post, Mudhol tq Bagalkot dist',
            'KSI Agritech, Sy no,202/1A , 202/1B Hebbal Post Tq.Mudhol Dist.Bagalkot',
            'Kumar Enterprises, Plot No. 16/D, Road No. 7 IDA Nacharam, Hyderabad',
            'M.R PIPES, Plot No.34P,KIADB Industrial Area,Vemagal,Kolar District-563128',
            'Mahanandi Irrigation, Rachana Palli Village, Ananthapur',
            'Mahesh Krushi Udyog Pvt Ltd, Maharastra',
            'Mahindra EPC Irrigation Ltd, Plot No.117/179, Rayapur Industrial area,Near Railway good shed rayapur',
            'Makknow Industries, 632 A 633 Urla industrial area, urla, Raipur, Chattisgarh',
            'Mangalam Pipes Pvt Ltd, No 5 5th Cross H Siddaiah Road, Near Lalbagh Sudhamanagar, Bangalore 560027',
            'Megha Agrotech Pvt Ltd, No.196, Bannerghatta Road, Arakere Gate, Bangalore 560076',
            'Mohak agro industries, Plt. No. 1, Industrial Estate, Nagar-Pune road, Kedagon, Ahmednagar',
            'Mohit Polytech (P) Ltd, F 139 ROAD NO 06 RIICO IND AREA BINDAYKA JAIPUR',
            'Mountfield Industries, Sy.No.1051/A/4, Mahalbagayat Industrial Area, Vijayapura',
            'Multi Golden Irrigations, Sy No 178/9, Telsang Savalagi Road, Halalli, Tq Athani, Dist Belagum',
            'N S Industries, Sy No. 92/A/1 Mathpalli Road, Gugal Village, Raichuru',
            'Narmada Pipes, Survey no 210 211 plot no 1 2 3 and 4 Narmada road, veraval Shapar Rajkot',
            'Navkaar Extrusions, S4, SIDCO Industrial Estate, Hosur',
            'Netafim Irrigation India Pvt Ltd, Siddahaiah Puranik road, 1st floor, karania chambers, Basaveshwara nagara, Bengaluru',
            'Network Irrigation, Plot no 203 shri samarth co op ind estate pimpalgaon nashik Maharastra',
            'Nimbus pipes Ltd, G,9C, Kabir Marg,Banipark, Jaipur 302016',
            'Noble Green Agritech, Pvt Ltd, Babadeep complex, maharani road, siyagunj, Indore',
            'Om Irritech Limited.Sy. No.36, Behind Emerald Club, Near Shivam-2, Devda Village, Lodhika Tq, Rajkot',
            'P.V.C. Agritech, PVC Agritech Plot No 1 C1E and F KIADB Industrial Area Lokikere Road',
            'Pancham Enterprises, Mahalbagayat, KIADB Industrial Area, Vijayapura',
            'Paragon Irrigation Pvt Ltd. MIG 416,KHB colony Basavan Kudachi, Gujarath',
            'Parixit Irrigation Ltd, A5 GAMANAGATTI INDUSTRIAL AREA, TARIHAL,HUBLI',
            'Pragati pipe Industries Pvt Ltd, Rishab complex MG Road, Raipur',
            'Premier Irrigation Adritec Pvt Ltd, 271/1, Near GEF Post office,Mysore road, Banglore',
            'Priya Irrigation System, Swami Vivekanand Industrial Estate, Hadpsar, Pune, Maharashtra',
            'R.M. Drip & Sprinkler System Pvt. Ltd, Shineer Taluk, Nasik Dist',
            'R M Industries, Plot No 65 KIADB Industrial Area Vijayapur',
            'Ramdas Irrigation Systems Pvt. Ltd, Vedika Shoppies, Main Road, kopargaon, Maharastra',
            'Rishi Polymach Pvt Ltd, Koramangala, Bangalore',
            'Rivulis Irrigation India (Pvt) Ltd (FIMI), Old Mumbai Pune Highway Wakdewadi Shi, Vadodara, Gujarath',
            'Rungta Irrigation Ltd B7, Electronic Complex, Kushaiguda, Hyderabad, Telangana',
            'S R Drip Pipe Industries, PLOT D8, Industrial Estate, Bellary Road, Anantapuram',
            'Sadananda Pvc Pvt Ltd, Mudhol road, siddapur village, Jamkhandi, Bagalakote',
            'Satyanarayanaswamy irrigations, 15th block, beside Siddalingeshwara oil mill, Challakere, Chitradurga',
            'Sekhar Irrigation systems. 59/3, Guddalapalli, Garladinne M, Anantapuram (AP)',
            'Shiva Irrigation Systems, Sy.No. 72/1A19, Near Sri channabasaveshwara Temple Gubbi',
            'Shivakarti Ecosence, Belagum',
            'Shree Hasanamba Industries Private Limited No. 16, Dinam, B Katihalli Koppalu, Arsikere Road, Hassan',
            'Shree Industries, 122/1 OFF Bhimmankruppe village, Big Banayan tree road Kengeri, Hobli',
            'Shree Maruthi Irrigation System, A.No.4535/2466/37, Near JMFC Court, Pavagada Town, Tumakuru',
            'Shree Rama Drip Irrigation Industries, Khata No.579/239/ 2748/137/1, challekere road, Pavagada, Tumakuru',
            'Shri Mahalaxmi Drip Irrigations, s.no. 309/5, Buakud road, Raibag Rural, Belagavi',
            'Shri Radhygovind Polytech, P.No, 326/3, Vinyak City, Nimera, Near RIICO Industrial Area, Bindayka, Jaipur',
            'Shri Sai Ram Plastics and Irrigation, GAT No 2016 Umla road Nashirbad dist Jalgaon',
            'Siflon Drip & Sprinkler Pvt Ltd, SY No 31/1D 31/2A, Bellary Road, Rachanapalli Village, Ananthapur, Ap',
            'Signet Industries, VGM Complex 2 floor 1 st main, Nagarbhavi, 11 stage Banglore 560072',
            'Sonapolyplast Ltd, Plot No. 57 to 61,33,2,5,6 ,62,63 ,79,82, Industr ial Estate, Kopargaon',
            'Sree sai mitra Drip Industries pvt ltd. Hall no 1, Khata No 352,kallahalli, Chintamni tq,Chikkaballapur',
            'Sri Anajani Pipes Industries, Sy No 706 B2,B3 Ieeza vg Mdl Jogulamba Gadwal Dist',
            'Sri Sai Pipe Industries, Sy No.36/1, Wadgera Road, Gulsaram, Yadagiri',
            'Sri Venkateshwara Drip Irrigation Industries, Sy. no.364/92, yadagir To wadgeraroad, gulsaram, Yadagir',
            'SRM Plastochem Pvt Ltd, Near Toll Plaza, Sultanpur Road, Kota, Rajasthan',
            'SS Agro tech irrigation system No 114, 3rd cross, Mysore road Deepanjali nagar, Bengaluru',
            'Suguna Irrigation systems, Plot No A 11 8 1 B, Road No.9, Nacharam',
            'Sujay Irrigation Pvt Ltd, No 86, main road pete channappa Ind estate Kamkshipalya, Bengaluru',
            'Supreme drip system 41/1 2 nd main, Aziz sait Ind town Nayandanahalli mysore road',
            'Swastic Industries, 595 urla Industrial state',
            'Tanvi Irrigations, VPC No 701,Athani gokak main road, shankaratti, Belagavi',
            'Tanvi Sprinklers, Athani-Gokak road, Shankratti, Belagavi',
            'USR Irrigations, Sy No 73/9 Kappalagiddi Road, Handigund Village, Raibag Tq, Belagavi-591235',
            'Vahini Irrigation Pvt Ltd, No 17, Near KPTCL sub station, Honnudike post, Gulur hobli, Tumakuru Tq & Dist',
            'Vankatesh Irrigation systems Pvt Ltd, HMT RIICO industrial Area Beawar road ajmir',
            'Vardhaman Polyextrusion, A24/1, A25 Midc Chincholi, Mohal, Solapur, Maharastra',
            'Varuna Neeravari Pvt Ltd, Dabaspet, Nelamangala tq, Banglore',
            'Vasaa Industries, RIICO Industrial Area Ramchandrapura Sitapura Extn, Jaipur, (Rajasthan)',
            'Vedanta Irrigation System Pvt Ltd, No 108E 6th Main 3rd Phase, Peenya Ind. Area',
            'Venkateswara Agri-Horti Solutions, Opp Anna Nagar, Basapur Road, Davanagere',
            'Venuka Polymers Private Limited, Magnet Corporate Park, Near Zydus Hospital, S.G. highway, Ahmedabad, Gujarath',
            'Vigneshwar Polymers, PLOT NO 585B , 586 BELUR INDUSTRIAL AREA DHARWAD',
            'Vishaka Plastic Pipes Pvt. Ltd, PB Road, Ahmedabad',
            'Vishwakarma Agriculture Implements, W.No 10, Door No 82/453, Near BDCC Bank,Parvagti nagar, Siruguppa',
            'VLAMPS Industries, KSSIDC, Industrial Estate, Mundaragi, Gadag'
        ]
    },
    {
        id: '31',
        type: 'question',
        text: 'What are the MI components received? (tick applicable)',
        question_type: 'multi-select',
        options: ['PVC', 'Venturi', 'Filter', ' Lateral ', 'Sprinkler', 'Valves', 'Raingun', 'Other(Specify)']
    },
    {
        id: '32',
        type: 'question',
        text: 'Is the MI System Still in Use? If No, share the reason',
        question_type: 'radio',
        options: ['Yes', 'No'],
        subQuestions: {
            triggerValue: 'No',
            questions: [
                {
                    id: '32a',
                    text: 'If No, Mention the reason',
                    question_type: 'text'
                }
            ]
        }
    },
    {
        id: '33',
        type: 'question',
        text: 'Did the MI agency or Government Department assist with the subsidy documentation? How was their response?',
    },
    {
        id: '34',
        type: 'question',
        text: 'Have you received any MI subsidy approval or payment communications? If yes, how did you received',
        question_type: 'multi-select',
        options: ['No Communication', 'SMS on Phone', 'Intimation from Village Assistant', 'Intimation from AO/HO', 'Intimation from MI', 'Payment not yet received'],
    },
    {
        id: '35',
        type: 'question',
        text: 'Did the MI or Dept take your signature after successful installation?',
        question_type: 'radio',
        options: ['Yes', 'No'],
    },
    {
        id: '36',
        type: 'question',
        text: 'What was the mode of MI subsidy disbursement?',
        question_type: 'multi-select',
        options: ['Received Directly to Bank', 'Payment made to MI supplier', 'Not yet received', 'Other(Specify)'],
    },
    {
        id: '37',
        type: 'question',
        text: 'Did you get any training or booklet on MI operation and maintenance? If yes, please give details',
        question_type: 'radio',
        options: ['Yes', 'No'],
    },
    {
        id: '38',
        type: 'question',
        text: 'Have you received any communication on MI System Warranty?',
        question_type: 'radio',
        options: ['Yes', 'No'],
    },
    {
        id: '39',
        type: 'question',
        text: ' Has the MI company provided any service after installation?',
        question_type: 'radio',
        options: ['Yes', 'No'],
    },
    {
        id: '40',
        type: 'question',
        text: 'Are you aware of the MI company’s service person, center, or helpline number? Please share details.',
    },
    {
        id: '41',
        type: 'question',
        text: 'When do you do the maintenance?',
        question_type: 'radio',
        options: ['Regularly', 'Occasionally', 'Never'],
    },
    {
        id: '42',
        type: 'question',
        text: 'Did you face any problems while using the MI system? If yes, please explain.',
    },
    {
        id: '43',
        type: 'question',
        text: 'Overall Satisfaction Level with MI System:',
        question_type: 'dropdown',
        options: ['Highly Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Highly Dissatisfied'],
    },
    {
        id: '44',
        type: 'question',
        text: 'Have you observed any reduction in water usage after the MI system? If yes, approx percentage reduction (%)',
        question_type: 'dropdown',
        options: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '75%', '100%'],
    },
    { id: '45', type: 'question', text: 'MI Financial Details – Total cost of MI system installed (₹ per acre)' },
    { id: '46', type: 'question', text: 'How much amount you paid to Department or Agency for MI instalation (₹ per acre)' },
    { id: '47', type: 'question', text: 'Have you taken any loan from a financial institution for MI? If yes, from where and how much (₹)' },
    { id: 'h4', type: 'heading', text: 'Socio economic impact' },
    {
        id: '48',
        type: 'question',
        text: 'Has the adoption of MI influenced your standard of living?',
        question_type: 'radio',
        options: ['Yes', 'No'],
    },
    {
        id: '49',
        type: 'question',
        text: 'What type of assets have you gained as a result?',
        question_type: 'multi-select',
        options: ['Household items', 'Livestock', 'Infrastructure', 'Education support', 'Agricultural quipment', 'Transport vehicle', 'Other(Specify)']
    },
    {
        id: '50',
        type: 'question',
        text: 'Has MI adoption in your village impacted labour?',
        question_type: 'dropdown',
        options: ['Reduced migration From Village to city', 'Increased migration From Village to city', 'No change'],
    },
    {
        id: '51',
        type: 'question',
        text: 'Did MI Adoption Create New Employment in Your Area?',
        question_type: 'radio',
        options: ['Yes', 'No'],
        subQuestions: {
            triggerValue: 'Yes',
            questions: [
                {
                    id: '66',
                    text: 'If Yes, Mention the reason',
                    question_type: 'text'
                }
            ]
        }
    },
    {
        id: '52',
        type: 'question',
        text: 'Has MI adoption helped women?',
        question_type: 'radio',
        options: ['Yes', 'No', 'Other(Specify)'],
        subQuestionsByValue: {
            'Yes': [
                {
                    id: '52a',
                    text: 'How has it helped? (tick all that apply)',
                    question_type: 'multi-select',
                    options: [
                        'Livestock Rearing',
                        'Business or Petty Shop',
                        'Alternate Employment Activity',

                    ]
                }
            ]
        }
    },
    {
        id: '53',
        type: 'question',
        text: 'Has any member of your family been trained on MI Maintenance by company?',
        question_type: 'radio',
        options: ['Yes', 'No'],
    },
    {
        id: '54',
        type: 'question',
        text: 'Have you observed any change in groundwater levels after MI adoption?',
        question_type: 'radio',
        options: ['Yes', 'No'],
    },
    {
        id: '55',
        type: 'question',
        text: 'Would you recommend MI to other farmers under the current scheme?',
        question_type: 'radio',
        options: ['Yes', 'No'],
    },
    {
        id: '56',
        type: 'question',
        text: 'Any issues from Dept or MI agency during approval? If yes, list them',
    },
    {
        id: '57',
        type: 'question',
        text: 'Have you attended any MI promotion activity organized by Government Departments? If yes, please provide the details.',
    },
    {
        id: '58',
        type: 'question',
        text: 'Have you got your Soil Tested & have the Soil Health card?',
    },
    {
        id: '59',
        type: 'question',
        text: 'Are you adopting the Nutrient Management Recommentations given in Soil Health Card?',
        question_type: 'radio',
        options: ['Yes', 'No'],
        subQuestions: {
            triggerValue: 'No',
            questions: [
                {
                    id: '59a',
                    text: 'If No, Mention the reason',
                    question_type: 'text'
                }
            ]
        }
    },
    {
        id: '60',
        type: 'question',
        text: 'Any Suggestions for Improving the MI Scheme?',
    },
    {
        id: '61',
        type: 'question',
        text: 'Any Additional comments?',
    },
    {
        id: '62',
        type: 'question',
        text: 'Location (Latitude/Longitude)',
        question_type: 'location',
    },
    { id: 'h7', type: 'heading', text: 'Farmer Photo' },
    {
        id: '63',
        type: 'question',
        text: 'Farmer Photo',
        question_type: 'photo'
    }
];
