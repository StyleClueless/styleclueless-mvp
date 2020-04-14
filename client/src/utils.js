export const company_id = "061e449f-04d7-4898-a1a8-b3d8a052b328"
export const renderS3UrlFromPrefix = (s3_url) => {
    const base_url = 'http://styleclueless-raw.s3-website-ap-southeast-1.amazonaws.com/';
    const scaleFactor = 300;
    const scaleString = scaleFactor + 'x' + scaleFactor + '/';
    const url = base_url + s3_url;

    const n = url.lastIndexOf("/");
    const newUrl = url.substring(0, n + 1) + scaleString + url.substring(n + 1)
    return newUrl
}

const colors = ['black', 'Dark', 'Light', 'White', 'Primary', 'Link', 'Info', 'Success', 'Warning', 'Danger']
export const taggingOptions
    =

    [
        {
            title: 'demography',
            selected:'top',
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
    ];
export const global_company_id="061e449f-04d7-4898-a1a8-b3d8a052b328";