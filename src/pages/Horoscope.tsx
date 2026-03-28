import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Briefcase, Coins, Activity, Moon, Sun, CalendarDays, CalendarRange } from 'lucide-react';
import ShareToWhatsApp from '../components/share/ShareToWhatsApp';
import AppQRCode from '../components/share/AppQRCode';

const MOON_SIGNS: Record<string, {
  name: string;
  hindiName: string;
  symbol: string;
  dates: string;
  element: string;
  ruler: string;
  color: string;
  luckyNumber: string;
  moonTraits: string;
}> = {
  mesh: { name: 'Aries', hindiName: 'Mesh (मेष)', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Agni (Fire)', ruler: 'Mangal (Mars)', color: 'Lal (Red)', luckyNumber: '9', moonTraits: 'Sahasik, Urjawaan, Neta' },
  vrishabh: { name: 'Taurus', hindiName: 'Vrishabh (वृषभ)', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Prithvi (Earth)', ruler: 'Shukra (Venus)', color: 'Hara (Green)', luckyNumber: '6', moonTraits: 'Dhairywaan, Sthir, Vishwasniya' },
  mithun: { name: 'Gemini', hindiName: 'Mithun (मिथुन)', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Vayu (Air)', ruler: 'Budh (Mercury)', color: 'Peela (Yellow)', luckyNumber: '5', moonTraits: 'Buddhimaan, Jigyasu, Chanchal' },
  kark: { name: 'Cancer', hindiName: 'Kark (कर्क)', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Jal (Water)', ruler: 'Chandra (Moon)', color: 'Safed (Silver/White)', luckyNumber: '2', moonTraits: 'Bhaavuk, Poshak, Sahaj' },
  singh: { name: 'Leo', hindiName: 'Singh (सिंह)', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Agni (Fire)', ruler: 'Surya (Sun)', color: 'Sona (Gold)', luckyNumber: '1', moonTraits: 'Tejasvi, Shahi, Dayalu' },
  kanya: { name: 'Virgo', hindiName: 'Kanya (कन्या)', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Prithvi (Earth)', ruler: 'Budh (Mercury)', color: 'Neela (Navy Blue)', luckyNumber: '5', moonTraits: 'Vyavharik, Vishleshan-karta, Sewa-bhavi' },
  tula: { name: 'Libra', hindiName: 'Tula (तुला)', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Vayu (Air)', ruler: 'Shukra (Venus)', color: 'Gulabi (Pink)', luckyNumber: '6', moonTraits: 'Santulit, Nyaypriya, Kalapremi' },
  vrishchik: { name: 'Scorpio', hindiName: 'Vrishchik (वृश्चिक)', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Jal (Water)', ruler: 'Mangal (Mars)', color: 'Gahra Lal (Dark Red)', luckyNumber: '8', moonTraits: 'Gehri soch, Niddar, Rahasyamay' },
  dhanu: { name: 'Sagittarius', hindiName: 'Dhanu (धनु)', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Agni (Fire)', ruler: 'Guru (Jupiter)', color: 'Neela (Blue)', luckyNumber: '3', moonTraits: 'Aazaad, Adventurous, Tattvagyan' },
  makar: { name: 'Capricorn', hindiName: 'Makar (मकर)', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Prithvi (Earth)', ruler: 'Shani (Saturn)', color: 'Bhura (Brown)', luckyNumber: '8', moonTraits: 'Mehanti, Anushasit, Dridh-nishchay' },
  kumbh: { name: 'Aquarius', hindiName: 'Kumbh (कुम्भ)', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Vayu (Air)', ruler: 'Shani (Saturn)', color: 'Neela (Blue)', luckyNumber: '4', moonTraits: 'Navachar, Maanvadikar, Drishtiwaan' },
  meen: { name: 'Pisces', hindiName: 'Meen (मीन)', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Jal (Water)', ruler: 'Guru (Jupiter)', color: 'Saamudri Hara (Sea Green)', luckyNumber: '7', moonTraits: 'Sahisnuta, Kalpanasheel, Adhyatmik' },
};

type TabType = 'daily' | 'monthly' | 'yearly';

const DAILY_HOROSCOPES: Record<string, { general: string; love: string; career: string; finance: string; health: string; score: { love: number; career: number; finance: number; health: number } }> = {
  mesh: { general: 'Aaj Mangal ki drishti aap par shubh phal de rahi hai. Koi bhi naya kaam shuru karne ke liye yeh din uttar hai. Parivar mein sukh-shanti banee rahegi aur vyavahar mein mithaas aayegi.', love: 'Prem sambandh mein meetha pal aayega. Saathi ke saath kuch vishesh samay bitayen.', career: 'Karyasthali mein aapki mehnat ko pahchaana jaayega. Boss ki prashansa milegi.', finance: 'Aarthik sthiti theek rahegi. Koi purana bhagtaan ho sakta hai.', health: 'Sar dard se bachne ke liye paani zyada piyen. Vyayam labhdaayak rahega.', score: { love: 4, career: 5, finance: 3, health: 4 } },
  vrishabh: { general: 'Shukra ki anukampa se aaj aapka din roshan rahega. Kala aur sundarata se jude karyon mein safalta milegi. Ghar mein ek sukhad vatavaran banaye rakhein.', love: 'Prem jeevan mein romantik samay hai. Apni bhaavnaon ko khulkar vyakt karen.', career: 'Naye project mein safalta milegi. Sahakarmion ka sahyog milega.', finance: 'Nivesh ke liye aaj ka din thoda prateeksha ka hai.', health: 'Aahaar par dhyaan den. Mithai ka sevan kam karen.', score: { love: 5, career: 4, finance: 3, health: 3 } },
  mithun: { general: 'Budh aapki vani aur buddhi ko tej kar rahe hain. Sanchar aur yatra se shubh samachar aane ki sambhavna hai. Naye logon se milna labhdaayak rahega.', love: 'Baatein karne se sambandh mazboot honge. Khulkar dialogue karen.', career: 'Koi naya mauka dwaar khatkhatata hai. Usse pakden.', finance: 'Aaj vyapar mein laabh ki sambhavana hai.', health: 'Neend poori len, thakaan mehsoos ho sakti hai.', score: { love: 3, career: 5, finance: 4, health: 3 } },
  kark: { general: 'Chandra aaj aapki rashi par vishesh drishti rakh rahe hain. Parivarik maahol mein sneh aur mamta barsi. Ghar-grihasathi ke kaam mein man lagega.', love: 'Ghar mein priya jan ke saath achcha time bitayein. Pyaar prakat karna na bhulen.', career: 'Karyasthali par aaj thoda bhaavukta se bachna hoga. Practical rahein.', finance: 'Ghar ke kharche par niyantran rakhen.', health: 'Paet ki samasyaon se sawdhaan rahein.', score: { love: 5, career: 3, finance: 3, health: 4 } },
  singh: { general: 'Surya ki tej shakti aaj aapke saath hai. Netatva aur prabhav ki drishti se yeh din uttam hai. Aapka vyaktitva logon ko prabhavit karega.', love: 'Apne saathi ko special feel karayen. Ek surprise plan karen.', career: 'Aaj aap kisi bhi samiti ya team ka netritva kar sakte hain.', finance: 'Dhana laabh ki sambhavana hai, sahi jagah invest karen.', health: 'Hriday ki sehat ka dhyaan rakhein. Vyayam zaroor karen.', score: { love: 4, career: 5, finance: 4, health: 3 } },
  kanya: { general: 'Budh aapki sochne-samajhne ki shakti ko badha rahe hain. Vistrit kaam karne mein mahaaraat aayegi. Swaasthya ke prati jagruk rahein.', love: 'Sambandhon mein vyavaharikta se kaam len, aaj thoda flexible rahein.', career: 'Detail kaam mein aaj safalta milegi. Papers aur documents sahi rakhein.', finance: 'Chote-chote kharche jod den, bade niqsaan ban sakte hain.', health: 'Antra ki sehat ka dhyaan rakhein, poshak aahar len.', score: { love: 3, career: 5, finance: 4, health: 4 } },
  tula: { general: 'Shukra ki kripa se aaj jeevan mein santulantata aur saundaryabodh badhega. Log aapki raay manenge. Nyay aur satya ke saath chalein.', love: 'Prem mein meetha mushkil door hoga. Saathi se samjhauta karna faydamand.', career: 'Teamwork mein aaj behtar kaary sambhav. Partnership mein shubh.', finance: 'Dhana aane ka rasta khulta dikh raha hai.', health: 'Kidney aur kamar ka dhyaan rakhein.', score: { love: 4, career: 4, finance: 4, health: 3 } },
  vrishchik: { general: 'Aaj Mangal aur aapki gehri soch milkar kamaal karegi. Jo rahasya chhupa tha woh saamne aayega. Antradrishti ko prioirty den.', love: 'Gehre sambandh mein naya mod aayega. Vishwaas banaye rakhein.', career: 'Research aur jaanch-padtaal ke kaam mein safalta milegi.', finance: 'Nivesh sochsamajh kar karen, aaj ki sthiti mixed hai.', health: 'Tanav kam rakhein, meditation helpful rahega.', score: { love: 4, career: 4, finance: 3, health: 3 } },
  dhanu: { general: 'Guru ki anukampa aaj aap par barsi hui hai. Gyan, dhar-dharm aur yatra se jude karyon mein safalta milegi. Aasha aur umang banayi rakhein.', love: 'Naya prem sambandh banne ki sambhavana ya purana sambandh mazboot hoga.', career: 'Shiksha, adhyapan ya prakashan se jude kaam mein laabh.', finance: 'Duur desh se dhana laabh ho sakta hai.', health: 'Kamar aur jaangh ka dhyaan rakhein, stretching karen.', score: { love: 4, career: 5, finance: 4, health: 3 } },
  makar: { general: 'Shani ki drishti se aaj mehnat ka fal milega. Sabr aur anushasan se badhe. Vyavsayik kshetre mein ek bada kadam uthane ka samay.', love: 'Parivar ke buzurgon ka aashirwad len. Rishton mein zimmedari nibhayen.', career: 'Karyasthali mein promotion ya sammaan ka mauka aa sakta hai.', finance: 'Dhana sanchay ke liye yeh din accha hai. Tasty mein investment karen.', health: 'Haddion aur ghutno ka dhyaan rakhein. Calcium len.', score: { love: 3, career: 5, finance: 4, health: 3 } },
  kumbh: { general: 'Shani aur Uranus ke sanyog se aaj nayi soch aur nayi dishaon ki taraf kadam badhen. Samaj seva mein bhaag len. Mitron ka saath labhdaayak rahega.', love: 'Dosti se prem ka safar shuru ho sakta hai. Purani yaadein taazaa hongi.', career: 'Technology aur innovation mein naye avsar aa rahe hain.', finance: 'Group ya network ke zariye laabh ho sakta hai.', health: 'Paer aur pair ki navon ka dhyaan rakhein.', score: { love: 4, career: 4, finance: 4, health: 3 } },
  meen: { general: 'Guru ki anukampa se aaj aapki aatma-shakti aur spandana tej hai. Adhyatmik karyon mein man lagega. Kalpana-shakti aur srijanatmakta ka labh uthayen.', love: 'Romantic aur sapnon wala din. Apni bhaavnaon ko kala ya kavita mein vyakt karen.', career: 'Kalaatmak ya adhyatmik kshetra mein aaj vishesh safalta.', finance: 'Intuition se driven koi financial decision aaj sahi sabit ho sakta hai.', health: 'Neend aur swaapna par dhyaan den. Paed ko aaram den.', score: { love: 5, career: 4, finance: 3, health: 4 } },
};

const MONTHLY_HOROSCOPES: Record<string, { general: string; love: string; career: string; finance: string; health: string }> = {
  mesh: { general: 'Is maah Mangal ki dasha aapke liye uttha-patak leke aayi hai, lekin ant mein safalta nishchit hai. Maah ke pehle paksh mein zyada dhyan karyasthali par den. Doosre paksh mein parivarik maahol mein sudhar aayega.', love: 'Prem jeevan mein ek aham faislaa karne ka samay aaya hai. Saathi ke saath khule dil se baat karen.', career: 'Career mein naya mod aane wala hai. Ek naya project ya nayi naukri ka avsar dikh raha hai.', finance: 'Maah ke beech mein kuch kharche badhenge, budget manage karen.', health: 'Sar aur aankhon ka dhyaan rakhein. Yoga aur praanayaam karna shuru karen.' },
  vrishabh: { general: 'Shukra is maah aapki rashi mein zyada prabhavshali hain. Kala, sangeet aur saundarya se jude kaam mein gehri ruchi badhegi. Ghar-grihasathi ke kaam bhi sukhad rahenge.', love: 'Prem jeevan mein madhurya aa rahi hai. Partner ke saath koi trip ya special moment plan karen.', career: 'Is maah mein naye sauda-suledha ki sambhavana hai. Vyapar mein barakah aayegi.', finance: 'Maah ke ant mein aarthik sthiti behtar hogi. Dhairya rakhen.', health: 'Galay aur naak ki takleef se bachein. Neem gunguna paani piyen.' },
  mithun: { general: 'Budh ki sanchaar priya dasha mein aap bahut sari nayi jaankaari aur logon se jude rahenge. Yatra ke yog bante hain. Naye log, naye avsar lekar aayenge.', love: 'Maah ke pehle half mein ek nayi mulakat ho sakti hai. Sangeet ya kavita se apna mann batayen.', career: 'Writing, media ya communication field mein bada break aa sakta hai.', finance: 'Vyapar mein multiple sources se laabh ki sambhavana hai.', health: 'Haath aur kaandhe ki sehat par dhyaan den. Stress kam karen.' },
  kark: { general: 'Chandra aapki rashi ke swami hain aur is maah unki dasha zyada prabhavshali hai. Parivarik sukh mein badhav aur maa ki sehat ka dhyaan rakhna zaroori hai.', love: 'Ghar aur parivar mein prem ka maahol hai. Khandan se rishte mazboot karein.', career: 'Ghar se kaam karne wale logon ke liye yeh maah uttam hai.', finance: 'Zameen-jaaydaad se jude lenden mein safalta.', health: 'Pet aur seene ki sehat par dhyaan den. Shudh paani piyen.' },
  singh: { general: 'Surya aapki rashi mein bahut tej hain is maah. Logon par aapka prabhav zyada rahega. Netritva ke avsar aayenge aur aap unhe baakhoobi sambhalenge.', love: 'Romantic rishton mein nayi urja aayegi. Shaadi ke yog bhi ban rahe hain.', career: 'Ek bada award ya sammaan milne ki sambhavna hai. Naye manthan ka mauka.', finance: 'Maah ke shuruaat mein bade kharche sambhav, baad mein balance aayega.', health: 'Hriday ki sehat ka khayal rakhein. BP check karate rahein.' },
  kanya: { general: 'Budh is maah aapko ek gyanvaan aur kushal karyakarta bana rahe hain. Swaasthya, seva aur vyayam ka maah hai. Kuch puraane kaamon ko poora karne ka samay.', love: 'Apni bhaavnaon ko zyada vyavaharik roop den. Partner ki zarooraten samjhein.', career: 'Office ka kaam is maah gehraai se karna hoga. Papers aur documents ka dhyaan.', finance: 'Chhote niveshon mein zyada dhyaan den. Shayad ek naya source khulega.', health: 'Aahaar shuddh rakhein. Antron ki sehat ke liye yogasana labhdaayak.' },
  tula: { general: 'Is maah Shukra ki kripa se prem aur jeevan mein samriddhi ka anubhav hoga. Naye log jeewan mein aayenge. Saazish aur vivad se door rahein aur santulanta banaen.', love: 'Vivah ke yog bante dikh rahe hain. Prem jeevan mein meetha pal aayega.', career: 'Partnership aur sahyog se badhe. Ek naya sahyogi kaam ko aage badhayega.', finance: 'Maah mein dhana aana-jaana tez rahega. Savings par focus karen.', health: 'Kamar dard se bachne ke liye baithne ka tarika sudharen.' },
  vrishchik: { general: 'Is maah Mangal aur Shani ka dwitiya takraav aapke andaar ek gahari kranti la raha hai. Aap apne aap ko naye roop mein dekhenge. Purani cheezon ko chodne ka samay.', love: 'Purane rishton mein naya josha aa sakta hai. Vishwaas badhayein.', career: 'Research, detective ya medical field ke logon ke liye badhiya maah.', finance: 'Shared finances ya investment mein dhyaan required. Doosron par aankh moond kar bharosa na karen.', health: 'Hormonal health aur reproductive system ka dhyaan rakhein.' },
  dhanu: { general: 'Guru ki drishti is maah aapke liye gyaan ka mandir khol rahi hai. Yatra, adhyaayan aur dharm se jude kaam mein safalta milegi. Vishwaas aur aasha ka maah hai.', love: 'Door desh mein ya door ki jagah se koi rishta banana ya banana ho sakta hai.', career: 'Education ya training se juda naya avsar aa sakta hai.', finance: 'Door se aane wala dhana laabh maah ke end mein possible.', health: 'Jaangh aur kamar ki sehat ka khayal rakhein. Trekking helpful.' },
  makar: { general: 'Shani apni rashi ke swami hain aur is maah woh aapko anek parikshaaon se guzerengi. Lekin har pariksha ke baad aap zyada mazboot nikelenge. Mehnat aur sabr ka phal milega.', love: 'Parivar ke sath zimmedariyan nibhane ka maah. Partner ki baat dhyaan se sunein.', career: 'Career mein ek badi chhalaang laga sakte hain is maah. Confidence rakhen.', finance: 'Dhana sanchay ka achi maah. Yahan Invest karna sahi rahega.', health: 'Joints aur skin ka dhyaan rakhein. Winter skin care zaroor karen.' },
  kumbh: { general: 'Is maah Shani aur Uranus ka sanyog aapke andar ek nayi kranti jagayega. Samajik karyon mein zyada shamil hona aur shatru-mitron ki pahchan karna zaroori hai.', love: 'Dosti wali friendship se prem ki taraf badhne ki sambhavana. Naye log milenge.', career: 'Technology, AI ya digital field mein bade avsar aa rahe hain.', finance: 'Group investments ya crowdfunding se laabh ho sakta hai.', health: 'Naasika aur Saans ki takleef se bachein. Praanayaam karein.' },
  meen: { general: 'Guru ki anukampa se is maah aapka jeevan ek naye adhyaaya mein pravesh karega. Adhyatmik uplabdhi ka yeh samay hai. Apni srishti aur kalpana-shakti ka upyog karen.', love: 'Romantic aur khayal-parchaai wala maah. Saathi ke saath ek art ya music class join karen.', career: 'Kalaatmak, adhyatmik ya healing related karyon mein vishesh safalta.', finance: 'Intuition se driven investment is maah fal de sakti hai.', health: 'Paon aur immune system ka dhyaan rakhein. Meditation zaroor karen.' },
};

const YEARLY_HOROSCOPES: Record<string, { general: string; love: string; career: string; finance: string; health: string; highlights: string[] }> = {
  mesh: { general: 'Varsh 2025 Mesh rashi ke liye ek mahatvapurna mod lekar aata hai. Mangal ki dasha mein aap naye aavishkar karenge. Pehle 6 maah mein karyasthali mein challeneg honge lekin baad ke 6 maah mein abhootpurva safalta milegi. Yeh varsh aapki zindagi ka turning point sabit hoga.', love: 'Varsh ke madhya mein prem jeevan mein ek bada aur sunehri mod aayega. Vivah ya commitment ki sambhavna zyada hai.', career: 'Career mein naya adhyaaya shuru hoga. Kuch log apna vyapar shuru kar sakte hain.', finance: 'Varsh ke doosre half mein aarthik stithi mein shudhaar aayega. Real estate mein invest karna laabhdaayak rahega.', health: 'Neend aur taakaat par dhyaan den. Sar dard ki samasya ho sakti hai.', highlights: ['Nayi naukri ya promotion (Maai-June)', 'Prem mein naya rishta (July-August)', 'Aarthik laabh (September-November)', 'Parivarik sukh (December)'] },
  vrishabh: { general: 'Vrishabh rashi ke liye 2025 ek samriddhi aur sthirta ka varsh hai. Shukra ki kripa se aapke jeevan mein saundarya, prem aur samriddhi ka samyog banata rahega. Ghar-grihasathi mein sukh aur karyasthali mein sammaan milega.', love: 'Prem jeevan mein meethi madhurta rahegi. Long-term relationship mein naya commitment ho sakta hai.', career: 'Creative aur artistic field mein bahut bada naam aur kaam milega is saal.', finance: 'Sthir aur surakshit aarthik sthiti. Zameen-jaaydaad mein invest karna sahi.', health: 'Galay aur thyroid par dhyaan den. Neem warm paani piyen.', highlights: ['Kala kshetra mein sammaan (March-April)', 'Prem mein nayi shuraat (June)', 'Ghar kharidna ya banana (August-September)', 'Vyapar mein laabh (November-December)'] },
  mithun: { general: 'Mithun rashi ke liye 2025 ek tivra sanchaar aur vikaas ka varsh hai. Budh ki anukampa se nayi jaankaari, naye log aur naye avsar bharpoor aayenge. Yatra, shiksha aur communication se bade avsar milenge.', love: 'Naye log milenge. Ek naya prem sambandh ya purane sambandh mein nayi gehraayi aa sakti hai.', career: 'Writing, Journalism, Media ya Social Media mein badi safalta ka varsh.', finance: 'Multiple sources se aay badhegi. Stocks ya mutual funds mein invest karna profitable.', health: 'Haanth, lungs aur naasika ka dhyaan rakhein.', highlights: ['Media ya communication mein bada avsar (January-February)', 'Naya prem rishta (April-May)', 'Phoren yatra ya online kaam (July-August)', 'Vyapar expansion (October-November)'] },
  kark: { general: 'Kark rashi ke liye 2025 ghar, parivar aur andar ki duniya ka varsh hai. Chandra ki shakti se aap apni bhaavnaon ko behtar samjhenge. Maa ka aashirwad aur parivarik sukh is saal apni charam par hoga.', love: 'Vivah ke yog bahut prbal hain. Parivar ke saath sunehre pal jiye jaayenge.', career: 'Ghar se kaam karne wale, freelancers ya online business waalon ke liye yeh varsh shreshth hai.', finance: 'Real estate se laabh hoga. Ghar ya zameen kharidna is saal fal dega.', health: 'Seene aur pet ki sehat ka dhyaan rakhein.', highlights: ['Ghar kharidne ya banana ka mauka (March)', 'Shaadi ya engagement (June-July)', 'Career mein naya avsar (September)', 'Parivarik sukh ki charam (December)'] },
  singh: { general: 'Singh rashi ke liye 2025 tej aur prataapshali varsh hai. Surya ki tej shakti aapko logon ke beech star bana degi. Netritva, sammaan aur pratishtha is saal aasman chhuengi.', love: 'Prem jeevan mein ek royal aur passionate sambandh banta dikh raha hai. Vivah ke yog sunehre hain.', career: 'Leadership role mein aane ka is saal behtar avsar. Government job waalon ke liye promotion.', finance: 'Share market ya business mein bade laabh ki sambhavna. Dhan aayega aur jayega, savings zaroori hai.', health: 'Hriday aur peeth ka dhyaan rakhein. Cardio vyayam daily karen.', highlights: ['Promotion ya award (February-March)', 'Prem mein nayi urja (May-June)', 'Business expansion (August)', 'Bada sammaan ya recogniton (November)'] },
  kanya: { general: 'Kanya rashi ke liye 2025 mehnat, sewa aur vyavhaarikta ka varsh hai. Budh ki shakti se aap zindagi ke har khetra mein systematic tarike se safalta haasil karenge. Swaasthya aur routine par dhyaan den.', love: 'Prem mein vyavhaarikta aur gehraayi ka sanyog banega. Ek stable aur vishwasaniya rishta milega.', career: 'Office kaam mein zyada mehnat karni padegi lekin phal bhi bada milega. Promotion sambhav.', finance: 'Chhote chhote nivesh is saal bade fal denge. SIP shuru karen.', health: 'Aahaar aur digestion par vishesh dhyaan. Probiotics faydemand.', highlights: ['Naukri mein badi zimmedari (January-February)', 'Health routine shuru (April)', 'Partner ke saath nayi shuruat (July)', 'Financial stability (October-November)'] },
  tula: { general: 'Tula rashi ke liye 2025 rishton, partnership aur sangeetatmak jeevan ka varsh hai. Shukra ki anukampa se prem aur vyapar dono mein nayi unchaaiyaan milegi. Santulan aur nyay aapka maarg darshan karega.', love: 'Vivah ya engagement ke liye yeh varsh ati uttam hai. Prem jeevan mein sunehri dauran.', career: 'Partnership business ya joint ventures ke liye yeh varsh shreshth hai.', finance: 'Partnerships se aay zyada hogi. Legal matters mein safalta milegi.', health: 'Kidney aur bladder ka dhyaan. Khub paani piyen.', highlights: ['Engagement ya vivah (March-April)', 'Business partnership (June)', 'Legal jeet ya settlement (August)', 'Aarthik safalta (October-December)'] },
  vrishchik: { general: 'Vrishchik rashi ke liye 2025 aik gehri aur transformative journey ka varsh hai. Aap apne aap ko naye roop mein dekhenge. Purani cheezon ko chodna aur naya swagat karna is saal ki khaas baat hogi.', love: 'Gahri bhaavnaon wala rishta milega ya purana rishta aur gehraata badhega. Secrecy se baahir aayein.', career: 'Research, investigation, psychology ya medical field mein badi safalta.', finance: 'Shared funds, inheritance ya insurance se aarthik laabh ho sakta hai.', health: 'Reproductive health aur immune system par dhyaan rakhein.', highlights: ['Purana rishta khatam ya naya shuruaat (January-February)', 'Career mein major shift (May)', 'Aarthik laabh (July-August)', 'Aatma-jaagran (November-December)'] },
  dhanu: { general: 'Dhanu rashi ke liye 2025 Guru ki vishesha drishti wala varsh hai. Gyan, yatra, dharma aur unchchi shiksha se jude sabhi kaamon mein badi safalta milegi. Vishwaas aur aasha aapki sabse badi taakat rahegi.', love: 'Door desh mein ya phoren connection se prem ka naata ban sakta hai. Swatantr prem jeevan.', career: 'Teaching, coaching, training ya publishing mein bada naam aur kaam.', finance: 'Import-export ya international business mein bada laabh.', health: 'Kamar aur jaangh ki sehat. Trekking ya outdoor sports beneficial.', highlights: ['Phoren yatra ya online international kaam (February-March)', 'Uchchi shiksha mein safalta (May)', 'Prem mein nayi shuruat (August)', 'International business deal (November)'] },
  makar: { general: 'Makar rashi ke liye 2025 mehnat ka phal milne wala varsh hai. Shani apni hi rashi mein hain aur aapko anushasan aur sabr ka inam denge. Vyavsayik unchcha is saal aapki badi uplabdhi hogi.', love: 'Parivarik zimmedariyan aur prem dono mein santulan banaye rakhein. Long-term partner ke saath commitment.', career: 'Is saal career mein ek bada leap forward. Government job ya corporate sector mein promotion.', finance: 'Dhan sanchay ka achi varsh. Sona (Gold) ya real estate mein investment sahi rahega.', health: 'Ghutne, joints aur haddiyon ka dhyaan. Calcium aur Vitamin D len.', highlights: ['Career promotion (February-March)', 'Vyapar mein bada contract (May-June)', 'Ghar ya zameen kharidna (August)', 'Dhana sanchay (October-December)'] },
  kumbh: { general: 'Kumbh rashi ke liye 2025 aik nayi kranti aur samajik jaagran ka varsh hai. Shani aur Uranus ki sanyog shakti se aap samaj mein ek nayi alag disha sthapit karenge. Naye dost aur naye avsar aapki raah dekhenge.', love: 'Naye log jeewan mein aayenge. Dosti se prem ka naata banne ki puri sambhavna.', career: 'Technology, digital media, AI ya social work mein bade avsar khulenge.', finance: 'Group investments ya startups mein invest karna is saal laabhdaayak.', health: 'Naadimandal (nervous system) aur legs ka dhyaan rakhein.', highlights: ['Naye dost ya community (January-February)', 'Technology startup ya project (April-May)', 'Prem mein naya rishta (July)', 'Social recognition (October-November)'] },
  meen: { general: 'Meen rashi ke liye 2025 Guru ki vishesh anugrah wala varsh hai. Adhyatmik uplabdhi, kalaatmakta aur healing ke maamlein mein yeh varsh asaadharan rahega. Aapki antadrshti aur anubhuti tez rahegi.', love: 'Prem mein ek gahra aur sunehla sambandh banta dikh raha hai. Aatmik milan hoga.', career: 'Art, music, healing, spiritual coaching ya photography mein badi safalta.', finance: 'Intuition se driven investments is varsh fal dengi. Sona mein nivesh laabhdaayak.', health: 'Paon aur immune system ka dhyaan. Meditation aur yoga zaroori.', highlights: ['Adhyatmik jaagran (January-March)', 'Kalaatmak safalta (April-May)', 'Prem mein naya adhyaaya (July-August)', 'Healing ya spiritual mission (October-December)'] },
};

const AREA_SCORES_MONTHLY: Record<string, { love: number; career: number; finance: number; health: number }> = {
  mesh: { love: 4, career: 5, finance: 3, health: 4 },
  vrishabh: { love: 5, career: 4, finance: 4, health: 3 },
  mithun: { love: 3, career: 5, finance: 4, health: 3 },
  kark: { love: 5, career: 3, finance: 4, health: 3 },
  singh: { love: 4, career: 5, finance: 3, health: 3 },
  kanya: { love: 3, career: 5, finance: 4, health: 5 },
  tula: { love: 5, career: 4, finance: 4, health: 3 },
  vrishchik: { love: 4, career: 4, finance: 3, health: 3 },
  dhanu: { love: 4, career: 5, finance: 4, health: 3 },
  makar: { love: 3, career: 5, finance: 5, health: 3 },
  kumbh: { love: 4, career: 4, finance: 4, health: 3 },
  meen: { love: 5, career: 4, finance: 3, health: 4 },
};

const AREA_SCORES_YEARLY: Record<string, { love: number; career: number; finance: number; health: number }> = {
  mesh: { love: 4, career: 5, finance: 4, health: 3 },
  vrishabh: { love: 5, career: 4, finance: 4, health: 4 },
  mithun: { love: 4, career: 5, finance: 4, health: 3 },
  kark: { love: 5, career: 4, finance: 5, health: 3 },
  singh: { love: 5, career: 5, finance: 4, health: 3 },
  kanya: { love: 3, career: 5, finance: 4, health: 5 },
  tula: { love: 5, career: 4, finance: 5, health: 3 },
  vrishchik: { love: 4, career: 5, finance: 4, health: 3 },
  dhanu: { love: 4, career: 5, finance: 4, health: 3 },
  makar: { love: 3, career: 5, finance: 5, health: 3 },
  kumbh: { love: 4, career: 5, finance: 4, health: 3 },
  meen: { love: 5, career: 5, finance: 4, health: 4 },
};

export default function Horoscope() {
  const { sign } = useParams();
  const zodiac = sign ? MOON_SIGNS[sign.toLowerCase()] : null;
  const [activeTab, setActiveTab] = useState<TabType>('daily');

  const getScores = () => {
    if (activeTab === 'daily') return DAILY_HOROSCOPES[sign?.toLowerCase() || '']?.score;
    if (activeTab === 'monthly') return AREA_SCORES_MONTHLY[sign?.toLowerCase() || ''];
    return AREA_SCORES_YEARLY[sign?.toLowerCase() || ''];
  };

  const getData = () => {
    const key = sign?.toLowerCase() || '';
    if (activeTab === 'daily') return DAILY_HOROSCOPES[key];
    if (activeTab === 'monthly') return MONTHLY_HOROSCOPES[key];
    return YEARLY_HOROSCOPES[key];
  };

  const getWhatsAppMessage = () => {
    if (!zodiac) return '';
    const label = activeTab === 'daily' ? 'Aaj ka' : activeTab === 'monthly' ? 'Masik' : 'Varshik';
    const data = getData();
    return `*${label} Rashifal - ${zodiac.hindiName} ${zodiac.symbol}*\n\n${data?.general}\n\nShubh Rang: ${zodiac.color}\nShubh Ank: ${zodiac.luckyNumber}\nTatva: ${zodiac.element}\nSwami Graha: ${zodiac.ruler}\n\nApna Rashifal dekhein: ${window.location.origin}/horoscope`;
  };

  const scores = getScores();
  const data = getData();

  if (!zodiac) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Moon className="w-8 h-8 text-amber-400" />
              <h1 className="text-4xl md:text-5xl font-bold">Chandra Rashifal</h1>
            </div>
            <p className="text-gray-300 text-lg mt-2">Apni Chandra Rashi (Moon Sign) chunein aur paaein Dainik, Masik aur Varshik Rashifal</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-amber-300 text-sm">
              <Moon className="w-4 h-4" />
              <span>Vedic Jyotish mein Chandra Rashi sabse mahatvapurn hoti hai</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(MOON_SIGNS).map(([key, data]) => (
                <Link
                  key={key}
                  to={`/horoscope/${key}`}
                  className="bg-white rounded-2xl p-5 text-center hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 group"
                >
                  <span className="text-5xl block mb-3">{data.symbol}</span>
                  <h3 className="font-bold text-gray-800 text-sm">{data.hindiName}</h3>
                  <p className="text-xs text-gray-500 mt-1">{data.dates}</p>
                  <div className="mt-2 text-xs text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Dekhein &rarr;
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Moon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Chandra Rashi kya hoti hai?</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Vedic Jyotish mein Chandra Rashi (Moon Sign) woh rashi hoti hai jisme janam ke samay Chandra sthit tha.
                    Yeh aapki bhaavnaon, mann ki sthiti aur andar ki duniya ko darshati hai.
                    Surya Rashi (Sun Sign) se zyada, Chandra Rashi aapke jeewan ke anubhavon par zyada prabhav daalti hai.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <Link to="/horoscope" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Sabhi Rashiyaan
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-5xl">{zodiac.symbol}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold">{zodiac.hindiName}</h1>
              <p className="text-gray-300 mt-1">{zodiac.dates}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
                <span className="bg-white/10 px-3 py-1 rounded-full">{zodiac.element}</span>
                <span className="bg-white/10 px-3 py-1 rounded-full">{zodiac.ruler}</span>
                <span className="bg-amber-500/30 text-amber-300 px-3 py-1 rounded-full">{zodiac.moonTraits}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-sm">
            {([
              { id: 'daily' as TabType, label: 'Aaj ka', icon: Sun },
              { id: 'monthly' as TabType, label: 'Masik', icon: CalendarDays },
              { id: 'yearly' as TabType, label: 'Varshik', icon: CalendarRange },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all text-sm md:text-base ${
                  activeTab === id
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {data && (
            <>
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  {activeTab === 'daily' && <Sun className="w-5 h-5 text-amber-500" />}
                  {activeTab === 'monthly' && <CalendarDays className="w-5 h-5 text-amber-500" />}
                  {activeTab === 'yearly' && <CalendarRange className="w-5 h-5 text-amber-500" />}
                  <h2 className="text-xl font-bold text-gray-800">
                    {activeTab === 'daily' ? 'Aaj ka Rashifal' : activeTab === 'monthly' ? 'Masik Rashifal' : 'Varshik Rashifal 2025'}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  {data.general}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
                    Jeevan ke Kshetra
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: Heart, label: 'Prem / Rishte', color: 'text-red-500', key: 'love' as const },
                      { icon: Briefcase, label: 'Kariyer / Vyapar', color: 'text-blue-500', key: 'career' as const },
                      { icon: Coins, label: 'Dhan / Aarthik', color: 'text-green-500', key: 'finance' as const },
                      { icon: Activity, label: 'Swaasthya', color: 'text-teal-500', key: 'health' as const },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className="text-gray-700 text-sm">{item.label}</span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= (scores?.[item.key] ?? 3) ? 'text-amber-400' : 'text-gray-200'}`}
                              fill={star <= (scores?.[item.key] ?? 3) ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4">Shubh Tatva</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 text-sm">Shubh Rang</span>
                      <span className="font-semibold text-gray-800 text-sm">{zodiac.color}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 text-sm">Shubh Ank</span>
                      <span className="font-semibold text-gray-800 text-sm">{zodiac.luckyNumber}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 text-sm">Tatva</span>
                      <span className="font-semibold text-gray-800 text-sm">{zodiac.element}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 text-sm">Swami Graha</span>
                      <span className="font-semibold text-gray-800 text-sm">{zodiac.ruler}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {[
                  { icon: Heart, label: 'Prem aur Rishte', color: 'bg-red-50 border-red-100', iconColor: 'text-red-500', content: data.love },
                  { icon: Briefcase, label: 'Kariyer aur Vyapar', color: 'bg-blue-50 border-blue-100', iconColor: 'text-blue-500', content: data.career },
                  { icon: Coins, label: 'Dhan aur Arthik Sthiti', color: 'bg-green-50 border-green-100', iconColor: 'text-green-500', content: data.finance },
                  { icon: Activity, label: 'Swaasthya', color: 'bg-teal-50 border-teal-100', iconColor: 'text-teal-500', content: data.health },
                ].map((item) => (
                  <div key={item.label} className={`rounded-2xl p-5 border ${item.color}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                      <h4 className="font-semibold text-gray-800 text-sm">{item.label}</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>

              {activeTab === 'yearly' && 'highlights' in data && data.highlights && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-200">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
                    2025 ke Khaas Pal
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.highlights.map((highlight: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3">
                        <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                        <span className="text-gray-700 text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
            <div className="md:flex items-center justify-between gap-8">
              <div className="flex-1 mb-6 md:mb-0">
                <h3 className="text-xl font-bold mb-3">Gehri Jaankari Chahiye?</h3>
                <p className="text-gray-300 mb-6 text-sm">
                  Apni Janam Kundli ke aadhar par personalized rashifal aur upay ke liye hamare visheshagya jyotish se baat karen
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/astrologers"
                    className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors text-sm"
                  >
                    Jyotishi se Baat Karen
                  </Link>
                  <ShareToWhatsApp
                    message={getWhatsAppMessage()}
                    label="Rashifal Share Karen"
                    className="px-6 py-3 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AppQRCode label="App scan karen" size={110} />
                <p className="text-xs text-gray-400">Mitron ke saath share karen</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
