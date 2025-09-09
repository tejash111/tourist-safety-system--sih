export const Prompt = {
    "contents": [
        {
            "parts": [
                {
                    "text": `
            give response based on this data
[
  {
    "district_name": "Anjaw",
    "Women_Prop": "20.00%",
    "Children_Prop": "18.00%",
    "Violence_Prop": "56.00%",
    "Fraud_Prop": "6.00%"
  },
  {
    "district_name": "Changlang",
    "Women_Prop": "24.28%",
    "Children_Prop": "2.06%",
    "Violence_Prop": "69.55%",
    "Fraud_Prop": "4.12%"
  },
  {
    "district_name": "Papum Pare",
    "Women_Prop": "21.01%",
    "Children_Prop": "13.38%",
    "Violence_Prop": "57.58%",
    "Fraud_Prop": "8.03%"
  },
  {
    "district_name": "Dibang Valley",
    "Women_Prop": "13.64%",
    "Children_Prop": "2.27%",
    "Violence_Prop": "84.09%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "East Kameng",
    "Women_Prop": "16.02%",
    "Children_Prop": "7.03%",
    "Violence_Prop": "74.61%",
    "Fraud_Prop": "2.34%"
  },
  {
    "district_name": "West Kameng",
    "Women_Prop": "21.47%",
    "Children_Prop": "0.61%",
    "Violence_Prop": "73.62%",
    "Fraud_Prop": "4.29%"
  },
  {
    "district_name": "Kurung Kumey",
    "Women_Prop": "15.89%",
    "Children_Prop": "3.74%",
    "Violence_Prop": "75.70%",
    "Fraud_Prop": "4.67%"
  },
  {
    "district_name": "Lohit",
    "Women_Prop": "31.90%",
    "Children_Prop": "3.68%",
    "Violence_Prop": "57.06%",
    "Fraud_Prop": "7.36%"
  },
  {
    "district_name": "Longding",
    "Women_Prop": "16.76%",
    "Children_Prop": "1.62%",
    "Violence_Prop": "80.00%",
    "Fraud_Prop": "1.62%"
  },
  {
    "district_name": "Lower Dibang Valley",
    "Women_Prop": "18.00%",
    "Children_Prop": "5.33%",
    "Violence_Prop": "74.67%",
    "Fraud_Prop": "2.00%"
  },
  {
    "district_name": "East Siang",
    "Women_Prop": "24.04%",
    "Children_Prop": "13.40%",
    "Violence_Prop": "59.57%",
    "Fraud_Prop": "2.98%"
  },
  {
    "district_name": "Upper Siang",
    "Women_Prop": "12.09%",
    "Children_Prop": "20.88%",
    "Violence_Prop": "65.93%",
    "Fraud_Prop": "1.10%"
  },
  {
    "district_name": "West Siang",
    "Women_Prop": "28.71%",
    "Children_Prop": "8.91%",
    "Violence_Prop": "57.76%",
    "Fraud_Prop": "4.62%"
  },
  {
    "district_name": "Lower Subansiri",
    "Women_Prop": "6.33%",
    "Children_Prop": "3.80%",
    "Violence_Prop": "88.61%",
    "Fraud_Prop": "1.27%"
  },
  {
    "district_name": "Upper Subansiri",
    "Women_Prop": "20.58%",
    "Children_Prop": "10.29%",
    "Violence_Prop": "66.67%",
    "Fraud_Prop": "2.47%"
  },
  {
    "district_name": "Tawang",
    "Women_Prop": "26.09%",
    "Children_Prop": "4.35%",
    "Violence_Prop": "67.39%",
    "Fraud_Prop": "2.17%"
  },
  {
    "district_name": "Tirap",
    "Women_Prop": "18.02%",
    "Children_Prop": "3.60%",
    "Violence_Prop": "74.77%",
    "Fraud_Prop": "3.60%"
  },
  {
    "district_name": "Namsai",
    "Women_Prop": "13.45%",
    "Children_Prop": "10.34%",
    "Violence_Prop": "74.83%",
    "Fraud_Prop": "1.38%"
  },
  {
    "district_name": "Siang",
    "Women_Prop": "22.22%",
    "Children_Prop": "0.93%",
    "Violence_Prop": "75.00%",
    "Fraud_Prop": "1.85%"
  },
  {
    "district_name": "Kamrup Metro",
    "Women_Prop": "4.85%",
    "Children_Prop": "6.64%",
    "Violence_Prop": "75.57%",
    "Fraud_Prop": "12.94%"
  },
  {
    "district_name": "Barpeta",
    "Women_Prop": "10.08%",
    "Children_Prop": "15.99%",
    "Violence_Prop": "71.30%",
    "Fraud_Prop": "2.64%"
  },
  {
    "district_name": "Baksa",
    "Women_Prop": "14.44%",
    "Children_Prop": "27.51%",
    "Violence_Prop": "56.22%",
    "Fraud_Prop": "1.82%"
  },
  {
    "district_name": "Bongaigaon",
    "Women_Prop": "20.38%",
    "Children_Prop": "21.90%",
    "Violence_Prop": "57.58%",
    "Fraud_Prop": "0.15%"
  },
  {
    "district_name": "Cachar",
    "Women_Prop": "8.96%",
    "Children_Prop": "24.93%",
    "Violence_Prop": "62.21%",
    "Fraud_Prop": "3.90%"
  },
  {
    "district_name": "Chirang",
    "Women_Prop": "15.71%",
    "Children_Prop": "18.38%",
    "Violence_Prop": "63.87%",
    "Fraud_Prop": "2.04%"
  },
  {
    "district_name": "Darrang",
    "Women_Prop": "23.82%",
    "Children_Prop": "10.75%",
    "Violence_Prop": "63.61%",
    "Fraud_Prop": "1.82%"
  },
  {
    "district_name": "Dhemaji",
    "Women_Prop": "20.25%",
    "Children_Prop": "19.79%",
    "Violence_Prop": "58.16%",
    "Fraud_Prop": "1.81%"
  },
  {
    "district_name": "Dhubri",
    "Women_Prop": "21.39%",
    "Children_Prop": "12.93%",
    "Violence_Prop": "61.32%",
    "Fraud_Prop": "4.36%"
  },
  {
    "district_name": "Dibrugarh",
    "Women_Prop": "13.05%",
    "Children_Prop": "20.19%",
    "Violence_Prop": "60.93%",
    "Fraud_Prop": "5.83%"
  },
  {
    "district_name": "Goalpara",
    "Women_Prop": "12.23%",
    "Children_Prop": "18.93%",
    "Violence_Prop": "66.87%",
    "Fraud_Prop": "1.97%"
  },
  {
    "district_name": "Golaghat",
    "Women_Prop": "16.76%",
    "Children_Prop": "18.57%",
    "Violence_Prop": "63.21%",
    "Fraud_Prop": "1.46%"
  },
  {
    "district_name": "Hailakandi",
    "Women_Prop": "24.91%",
    "Children_Prop": "11.08%",
    "Violence_Prop": "60.26%",
    "Fraud_Prop": "3.75%"
  },
  {
    "district_name": "West Karbi Anglong",
    "Women_Prop": "21.07%",
    "Children_Prop": "14.93%",
    "Violence_Prop": "59.73%",
    "Fraud_Prop": "4.27%"
  },
  {
    "district_name": "Jorhat",
    "Women_Prop": "14.86%",
    "Children_Prop": "12.77%",
    "Violence_Prop": "61.44%",
    "Fraud_Prop": "10.92%"
  },
  {
    "district_name": "Kamrup",
    "Women_Prop": "20.67%",
    "Children_Prop": "13.00%",
    "Violence_Prop": "54.75%",
    "Fraud_Prop": "11.58%"
  },
  {
    "district_name": "Karbi Anglong",
    "Women_Prop": "10.29%",
    "Children_Prop": "23.07%",
    "Violence_Prop": "63.39%",
    "Fraud_Prop": "3.25%"
  },
  {
    "district_name": "Karimganj",
    "Women_Prop": "18.38%",
    "Children_Prop": "10.07%",
    "Violence_Prop": "67.46%",
    "Fraud_Prop": "4.09%"
  },
  {
    "district_name": "Kokrajhar",
    "Women_Prop": "27.11%",
    "Children_Prop": "24.99%",
    "Violence_Prop": "47.49%",
    "Fraud_Prop": "0.41%"
  },
  {
    "district_name": "Lakhimpur",
    "Women_Prop": "14.05%",
    "Children_Prop": "22.12%",
    "Violence_Prop": "57.45%",
    "Fraud_Prop": "6.39%"
  },
  {
    "district_name": "Marigaon",
    "Women_Prop": "13.69%",
    "Children_Prop": "18.84%",
    "Violence_Prop": "67.29%",
    "Fraud_Prop": "0.18%"
  },
  {
    "district_name": "Dima Hasao",
    "Women_Prop": "6.65%",
    "Children_Prop": "24.93%",
    "Violence_Prop": "62.60%",
    "Fraud_Prop": "5.82%"
  },
  {
    "district_name": "Nagaon",
    "Women_Prop": "16.36%",
    "Children_Prop": "23.13%",
    "Violence_Prop": "58.34%",
    "Fraud_Prop": "2.17%"
  },
  {
    "district_name": "Nalbari",
    "Women_Prop": "18.27%",
    "Children_Prop": "11.98%",
    "Violence_Prop": "63.45%",
    "Fraud_Prop": "6.29%"
  },
  {
    "district_name": "Sivasagar",
    "Women_Prop": "13.46%",
    "Children_Prop": "22.87%",
    "Violence_Prop": "58.57%",
    "Fraud_Prop": "5.11%"
  },
  {
    "district_name": "Sonitpur",
    "Women_Prop": "13.78%",
    "Children_Prop": "16.35%",
    "Violence_Prop": "69.79%",
    "Fraud_Prop": "0.08%"
  },
  {
    "district_name": "Tinsukia",
    "Women_Prop": "13.78%",
    "Children_Prop": "17.70%",
    "Violence_Prop": "67.30%",
    "Fraud_Prop": "1.22%"
  },
  {
    "district_name": "Udalguri",
    "Women_Prop": "14.53%",
    "Children_Prop": "11.50%",
    "Violence_Prop": "71.64%",
    "Fraud_Prop": "2.33%"
  },
  {
    "district_name": "Majuli",
    "Women_Prop": "18.69%",
    "Children_Prop": "15.81%",
    "Violence_Prop": "62.83%",
    "Fraud_Prop": "2.67%"
  },
  {
    "district_name": "Biswanath",
    "Women_Prop": "15.91%",
    "Children_Prop": "29.56%",
    "Violence_Prop": "51.12%",
    "Fraud_Prop": "3.41%"
  },
  {
    "district_name": "Hojai",
    "Women_Prop": "20.62%",
    "Children_Prop": "21.38%",
    "Violence_Prop": "52.36%",
    "Fraud_Prop": "5.64%"
  },
  {
    "district_name": "South Salmara Mancachar",
    "Women_Prop": "19.47%",
    "Children_Prop": "13.83%",
    "Violence_Prop": "64.61%",
    "Fraud_Prop": "2.10%"
  },
  {
    "district_name": "Charaideo",
    "Women_Prop": "12.99%",
    "Children_Prop": "23.77%",
    "Violence_Prop": "62.75%",
    "Fraud_Prop": "0.49%"
  },
  {
    "district_name": "Bishnupur",
    "Women_Prop": "8.03%",
    "Children_Prop": "16.44%",
    "Violence_Prop": "75.33%",
    "Fraud_Prop": "0.19%"
  },
  {
    "district_name": "Chandel",
    "Women_Prop": "0.89%",
    "Children_Prop": "10.71%",
    "Violence_Prop": "84.82%",
    "Fraud_Prop": "3.57%"
  },
  {
    "district_name": "Churachandpur",
    "Women_Prop": "4.63%",
    "Children_Prop": "12.96%",
    "Violence_Prop": "78.24%",
    "Fraud_Prop": "4.17%"
  },
  {
    "district_name": "Imphal West",
    "Women_Prop": "18.18%",
    "Children_Prop": "15.96%",
    "Violence_Prop": "55.04%",
    "Fraud_Prop": "10.82%"
  },
  {
    "district_name": "Imphal East",
    "Women_Prop": "11.76%",
    "Children_Prop": "13.18%",
    "Violence_Prop": "71.46%",
    "Fraud_Prop": "3.59%"
  },
  {
    "district_name": "Senapati",
    "Women_Prop": "4.03%",
    "Children_Prop": "6.45%",
    "Violence_Prop": "87.90%",
    "Fraud_Prop": "1.61%"
  },
  {
    "district_name": "Tamenglong",
    "Women_Prop": "1.15%",
    "Children_Prop": "4.60%",
    "Violence_Prop": "94.25%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Thoubal",
    "Women_Prop": "14.41%",
    "Children_Prop": "22.74%",
    "Violence_Prop": "56.50%",
    "Fraud_Prop": "6.36%"
  },
  {
    "district_name": "Ukhrul",
    "Women_Prop": "3.41%",
    "Children_Prop": "20.45%",
    "Violence_Prop": "76.14%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "East Garo Hills",
    "Women_Prop": "15.02%",
    "Children_Prop": "32.02%",
    "Violence_Prop": "43.48%",
    "Fraud_Prop": "9.49%"
  },
  {
    "district_name": "North Garo Hills",
    "Women_Prop": "11.40%",
    "Children_Prop": "38.16%",
    "Violence_Prop": "41.23%",
    "Fraud_Prop": "9.21%"
  },
  {
    "district_name": "South Garo Hills",
    "Women_Prop": "7.51%",
    "Children_Prop": "36.62%",
    "Violence_Prop": "53.99%",
    "Fraud_Prop": "1.88%"
  },
  {
    "district_name": "South West Garo Hills",
    "Women_Prop": "24.32%",
    "Children_Prop": "25.68%",
    "Violence_Prop": "48.65%",
    "Fraud_Prop": "1.35%"
  },
  {
    "district_name": "West Garo Hills",
    "Women_Prop": "12.37%",
    "Children_Prop": "31.59%",
    "Violence_Prop": "40.34%",
    "Fraud_Prop": "15.69%"
  },
  {
    "district_name": "West Jaintia Hills",
    "Women_Prop": "10.92%",
    "Children_Prop": "35.31%",
    "Violence_Prop": "51.08%",
    "Fraud_Prop": "2.70%"
  },
  {
    "district_name": "East Jaintia Hills",
    "Women_Prop": "20.62%",
    "Children_Prop": "27.17%",
    "Violence_Prop": "50.48%",
    "Fraud_Prop": "1.73%"
  },
  {
    "district_name": "East Khasi Hills",
    "Women_Prop": "14.38%",
    "Children_Prop": "31.70%",
    "Violence_Prop": "50.09%",
    "Fraud_Prop": "3.83%"
  },
  {
    "district_name": "South West Khasi Hills",
    "Women_Prop": "9.63%",
    "Children_Prop": "37.16%",
    "Violence_Prop": "47.71%",
    "Fraud_Prop": "5.50%"
  },
  {
    "district_name": "West Khasi Hills",
    "Women_Prop": "13.65%",
    "Children_Prop": "54.00%",
    "Violence_Prop": "31.19%",
    "Fraud_Prop": "1.17%"
  },
  {
    "district_name": "Ri Bhoi",
    "Women_Prop": "26.77%",
    "Children_Prop": "25.24%",
    "Violence_Prop": "44.34%",
    "Fraud_Prop": "3.66%"
  },
  {
    "district_name": "Aizawl",
    "Women_Prop": "17.34%",
    "Children_Prop": "26.09%",
    "Violence_Prop": "48.81%",
    "Fraud_Prop": "7.76%"
  },
  {
    "district_name": "Champhai",
    "Women_Prop": "12.50%",
    "Children_Prop": "51.21%",
    "Violence_Prop": "32.26%",
    "Fraud_Prop": "4.03%"
  },
  {
    "district_name": "Kolasib",
    "Women_Prop": "11.61%",
    "Children_Prop": "28.76%",
    "Violence_Prop": "56.99%",
    "Fraud_Prop": "2.64%"
  },
  {
    "district_name": "Lawngtlai",
    "Women_Prop": "12.67%",
    "Children_Prop": "29.33%",
    "Violence_Prop": "54.00%",
    "Fraud_Prop": "4.00%"
  },
  {
    "district_name": "Lunglei",
    "Women_Prop": "11.45%",
    "Children_Prop": "27.86%",
    "Violence_Prop": "58.40%",
    "Fraud_Prop": "2.29%"
  },
  {
    "district_name": "Mamit",
    "Women_Prop": "13.31%",
    "Children_Prop": "37.26%",
    "Violence_Prop": "47.15%",
    "Fraud_Prop": "2.28%"
  },
  {
    "district_name": "Saiha",
    "Women_Prop": "4.90%",
    "Children_Prop": "42.16%",
    "Violence_Prop": "52.94%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Serchhip",
    "Women_Prop": "12.50%",
    "Children_Prop": "33.15%",
    "Violence_Prop": "51.09%",
    "Fraud_Prop": "3.26%"
  },
  {
    "district_name": "Dimapur",
    "Women_Prop": "3.46%",
    "Children_Prop": "18.81%",
    "Violence_Prop": "62.05%",
    "Fraud_Prop": "15.68%"
  },
  {
    "district_name": "Kiphire",
    "Women_Prop": "14.81%",
    "Children_Prop": "0.00%",
    "Violence_Prop": "77.78%",
    "Fraud_Prop": "7.41%"
  },
  {
    "district_name": "Kohima",
    "Women_Prop": "15.14%",
    "Children_Prop": "12.84%",
    "Violence_Prop": "57.80%",
    "Fraud_Prop": "14.22%"
  },
  {
    "district_name": "Longleng",
    "Women_Prop": "9.09%",
    "Children_Prop": "4.55%",
    "Violence_Prop": "72.73%",
    "Fraud_Prop": "13.64%"
  },
  {
    "district_name": "Mokokchung",
    "Women_Prop": "6.06%",
    "Children_Prop": "10.10%",
    "Violence_Prop": "71.72%",
    "Fraud_Prop": "12.12%"
  },
  {
    "district_name": "Mon",
    "Women_Prop": "7.69%",
    "Children_Prop": "14.42%",
    "Violence_Prop": "75.00%",
    "Fraud_Prop": "2.88%"
  },
  {
    "district_name": "Peren",
    "Women_Prop": "10.00%",
    "Children_Prop": "13.33%",
    "Violence_Prop": "76.67%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Phek",
    "Women_Prop": "16.67%",
    "Children_Prop": "14.58%",
    "Violence_Prop": "64.58%",
    "Fraud_Prop": "4.17%"
  },
  {
    "district_name": "Tuensang",
    "Women_Prop": "9.84%",
    "Children_Prop": "21.31%",
    "Violence_Prop": "63.93%",
    "Fraud_Prop": "4.92%"
  },
  {
    "district_name": "Wokha",
    "Women_Prop": "1.14%",
    "Children_Prop": "14.77%",
    "Violence_Prop": "84.09%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Zunheboto",
    "Women_Prop": "3.95%",
    "Children_Prop": "25.00%",
    "Violence_Prop": "68.42%",
    "Fraud_Prop": "2.63%"
  },
  {
    "district_name": "Gangtok",
    "Women_Prop": "10.47%",
    "Children_Prop": "44.38%",
    "Violence_Prop": "38.08%",
    "Fraud_Prop": "7.07%"
  },
  {
    "district_name": "Mangan",
    "Women_Prop": "7.27%",
    "Children_Prop": "60.00%",
    "Violence_Prop": "32.73%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Namchi",
    "Women_Prop": "8.52%",
    "Children_Prop": "47.87%",
    "Violence_Prop": "40.82%",
    "Fraud_Prop": "2.79%"
  },
  {
    "district_name": "Gyalshing",
    "Women_Prop": "7.01%",
    "Children_Prop": "50.18%",
    "Violence_Prop": "38.01%",
    "Fraud_Prop": "4.80%"
  },
  {
    "district_name": "Dhalai",
    "Women_Prop": "7.31%",
    "Children_Prop": "12.12%",
    "Violence_Prop": "79.71%",
    "Fraud_Prop": "0.86%"
  },
  {
    "district_name": "Gomati",
    "Women_Prop": "13.78%",
    "Children_Prop": "16.25%",
    "Violence_Prop": "67.49%",
    "Fraud_Prop": "2.48%"
  },
  {
    "district_name": "West Tripura",
    "Women_Prop": "10.87%",
    "Children_Prop": "15.40%",
    "Violence_Prop": "63.86%",
    "Fraud_Prop": "9.86%"
  },
  {
    "district_name": "Khowai",
    "Women_Prop": "12.75%",
    "Children_Prop": "16.63%",
    "Violence_Prop": "68.00%",
    "Fraud_Prop": "2.63%"
  },
  {
    "district_name": "North Tripura",
    "Women_Prop": "16.98%",
    "Children_Prop": "15.33%",
    "Violence_Prop": "67.22%",
    "Fraud_Prop": "0.47%"
  },
  {
    "district_name": "Sepahijala",
    "Women_Prop": "12.01%",
    "Children_Prop": "35.78%",
    "Violence_Prop": "52.21%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "South Tripura",
    "Women_Prop": "9.46%",
    "Children_Prop": "11.62%",
    "Violence_Prop": "77.57%",
    "Fraud_Prop": "1.34%"
  },
  {
    "district_name": "Unakoti",
    "Women_Prop": "12.95%",
    "Children_Prop": "12.71%",
    "Violence_Prop": "71.91%",
    "Fraud_Prop": "2.43%"
  },
  {
    "district_name": "Kamle",
    "Women_Prop": "10.20%",
    "Children_Prop": "4.08%",
    "Violence_Prop": "79.59%",
    "Fraud_Prop": "6.12%"
  },
  {
    "district_name": "Kra Daadi",
    "Women_Prop": "16.67%",
    "Children_Prop": "0.00%",
    "Violence_Prop": "79.17%",
    "Fraud_Prop": "4.17%"
  },
  {
    "district_name": "Lower Siang",
    "Women_Prop": "16.00%",
    "Children_Prop": "0.80%",
    "Violence_Prop": "77.60%",
    "Fraud_Prop": "5.60%"
  },
  {
    "district_name": "Leparada",
    "Women_Prop": "30.00%",
    "Children_Prop": "6.00%",
    "Violence_Prop": "60.00%",
    "Fraud_Prop": "4.00%"
  },
  {
    "district_name": "Shi Yomi",
    "Women_Prop": "10.00%",
    "Children_Prop": "10.00%",
    "Violence_Prop": "80.00%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Pakke Kessang",
    "Women_Prop": "29.03%",
    "Children_Prop": "16.13%",
    "Violence_Prop": "48.39%",
    "Fraud_Prop": "6.45%"
  },
  {
    "district_name": "Bajali",
    "Women_Prop": "20.83%",
    "Children_Prop": "4.17%",
    "Violence_Prop": "51.39%",
    "Fraud_Prop": "23.61%"
  },
  {
    "district_name": "Tamulpur",
    "Women_Prop": "17.80%",
    "Children_Prop": "50.00%",
    "Violence_Prop": "32.20%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Kakching",
    "Women_Prop": "25.41%",
    "Children_Prop": "45.90%",
    "Violence_Prop": "28.69%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Kamjong",
    "Women_Prop": "0.00%",
    "Children_Prop": "0.00%",
    "Violence_Prop": "100.00%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Kangpokpi",
    "Women_Prop": "4.35%",
    "Children_Prop": "4.35%",
    "Violence_Prop": "82.61%",
    "Fraud_Prop": "8.70%"
  },
  {
    "district_name": "Jiribam",
    "Women_Prop": "7.89%",
    "Children_Prop": "23.68%",
    "Violence_Prop": "68.42%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Noney",
    "Women_Prop": "3.23%",
    "Children_Prop": "0.00%",
    "Violence_Prop": "93.55%",
    "Fraud_Prop": "3.23%"
  },
  {
    "district_name": "Pherzawl",
    "Women_Prop": "22.22%",
    "Children_Prop": "22.22%",
    "Violence_Prop": "55.56%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Tengnoupal",
    "Women_Prop": "9.52%",
    "Children_Prop": "20.63%",
    "Violence_Prop": "46.03%",
    "Fraud_Prop": "23.81%"
  },
  {
    "district_name": "Eastern West Khasi Hills",
    "Women_Prop": "17.39%",
    "Children_Prop": "47.83%",
    "Violence_Prop": "34.78%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Saitual",
    "Women_Prop": "0.00%",
    "Children_Prop": "28.57%",
    "Violence_Prop": "71.43%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Khawzawl",
    "Women_Prop": "28.57%",
    "Children_Prop": "45.71%",
    "Violence_Prop": "25.71%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Hnahthial",
    "Women_Prop": "30.77%",
    "Children_Prop": "15.38%",
    "Violence_Prop": "53.85%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Soreng",
    "Women_Prop": "5.56%",
    "Children_Prop": "66.67%",
    "Violence_Prop": "27.78%",
    "Fraud_Prop": "0.00%"
  },
  {
    "district_name": "Pakyong",
    "Women_Prop": "11.48%",
    "Children_Prop": "21.31%",
    "Violence_Prop": "65.57%",
    "Fraud_Prop": "1.64%"
  },
  {
    "district_name": "Siaha",
    "Women_Prop": "23.17%",
    "Children_Prop": "0.00%",
    "Violence_Prop": "76.83%",
    "Fraud_Prop": "0.00%"
  }
]
`
                }
            ]
        }
    ]
}