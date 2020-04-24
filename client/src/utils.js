import axios from "axios";

export const company_id = "061e449f-04d7-4898-a1a8-b3d8a052b328"
export const renderS3UrlFromPrefix = (s3_url, scale_factor = 300) => {
    if(s3_url===null || s3_url==='null')return '';
    const base_url = 'http://styleclueless-raw.s3-website-ap-southeast-1.amazonaws.com/';
    const scaleFactor = scale_factor;
    let scaleString = "";
    if (Number(scale_factor) > 0) {
        scaleString = scaleFactor + 'x' + scaleFactor + '/';
    }
    const url = base_url + s3_url;
    const n = url.lastIndexOf("/");
    const newUrl = url.substring(0, n + 1) + scaleString + url.substring(n + 1)
    return newUrl
}
export const timeoutPromise = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const colors = ['black', 'Dark', 'Light', 'White', 'Primary', 'Link', 'Info', 'Success', 'Warning', 'Danger']
export const taggingOptions
    =

    [
        {
            title: 'demography',

            values:
                [
                    "top"
                    , "bottom"
                    , "shoes"
                    , "jacket"
                    , "onepiece"
                    , "accessories"
                ],
            color: 'dark'
        },
        {
            title: 'class', values:
                ["men",
                    "women"
                    , "girls"
                    , "boys"
                ],
            color: 'success'
        }, {
        title: 'design', values:
            ["multicolour"
                , "plain"
            ],
        color: 'warning'
    }, {
        title: 'style', values:
            [
                "neutralWear", "comfySport", "casualSport", "casualFun", "casualIndustrial", "workSemi", "workFormal", "workFun", "financialFormal", "partyWear"
            ],
        color: 'danger'
    }
        ,
        {
            title: 'shade', values:
                [
                    "safe", "semiSafe", "colour"
                ],
            color: 'light'
        }
    ];
export const isUrlValid = (userInput) => {
    // debugger;
    var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    var regex = new RegExp(expression);
    let res = userInput.match(regex);
    // let res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null)
        return false;
    else
        return true;
}
export const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/' : 'https://www.styleclueless.com/';
export const postRequest = async (url, body) => {
    try {
        // debugger;
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
            },
        };
        let rawResponse = await axios.post(
            BASE_URL + url,
            body,
            axiosConfig
        );
        let content = '';
        if (rawResponse.status < 200 || rawResponse.status >= 300) {
            console.error(JSON.stringify(rawResponse));
            throw new Error('BAD REQUEST FOR POST WITH url=>' + url + 'BODY=>'+body);
        }
        if (rawResponse !== null && rawResponse !== undefined) {
            content = rawResponse.data;
        }
        return content;
    } catch (e) {
        console.error('GLOBAL POST REQUEST ERROR' + e);
        throw new Error(e);
    }
};
