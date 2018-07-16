# vebondi

> Version mobile de http://cordoba.cuandollega.net/

## Script para obtener paradas de colectivo

```javascript
{

    let list = [{
            value: "1278",
            key: "10"
        },
        {
            value: "1280",
            key: "11"
        },
        {
            value: "1279",
            key: "12"
        },
        {
            value: "1281",
            key: "13"
        },
        {
            value: "1282",
            key: "14"
        },
        {
            value: "1283",
            key: "15"
        },
        {
            value: "1284",
            key: "16"
        },
        {
            value: "1285",
            key: "17"
        },
        {
            value: "1286",
            key: "18"
        },
        {
            value: "1287",
            key: "19"
        },
        {
            value: "1299",
            key: "20"
        },
        {
            value: "1300",
            key: "21"
        },
        {
            value: "1301",
            key: "22"
        },
        {
            value: "1302",
            key: "23"
        },
        {
            value: "1303",
            key: "24"
        },
        {
            value: "1304",
            key: "25"
        },
        {
            value: "1305",
            key: "26"
        },
        {
            value: "1306",
            key: "27"
        },
        {
            value: "1307",
            key: "28"
        },
        {
            value: "1308",
            key: "29"
        },
        {
            value: "1309",
            key: "30"
        },
        {
            value: "1310",
            key: "31"
        },
        {
            value: "1311",
            key: "32"
        },
        {
            value: "1312",
            key: "33"
        },
        {
            value: "1313",
            key: "34"
        },
        {
            value: "1314",
            key: "35"
        },
        {
            value: "1315",
            key: "36"
        },
        {
            value: "1620",
            key: "45"
        },
        {
            value: "1621",
            key: "50"
        },
        {
            value: "1622",
            key: "51"
        },
        {
            value: "1623",
            key: "52"
        },
        {
            value: "1625",
            key: "53"
        },
        {
            value: "1626",
            key: "54"
        },
        {
            value: "1288",
            key: "60"
        },
        {
            value: "1631",
            key: "600"
        },
        {
            value: "1632",
            key: "601"
        },
        {
            value: "1289",
            key: "61"
        },
        {
            value: "1290",
            key: "62"
        },
        {
            value: "1291",
            key: "63"
        },
        {
            value: "1292",
            key: "64"
        },
        {
            value: "1293",
            key: "65"
        },
        {
            value: "1294",
            key: "66"
        },
        {
            value: "1295",
            key: "67"
        },
        {
            value: "1296",
            key: "68"
        },
        {
            value: "1329",
            key: 70
        },
        {
            value: "1330",
            key: "71"
        },
        {
            value: "1331",
            key: "72"
        },
        {
            value: "1332",
            key: "73"
        },
        {
            value: "1333",
            key: "74"
        },
        {
            value: "1334",
            key: "75"
        },
        {
            value: "1335",
            key: "80"
        },
        {
            value: "1336",
            key: "81"
        },
        {
            value: "1337",
            key: "82"
        },
        {
            value: "1338",
            key: "83"
        },
        {
            value: "1339",
            key: "84"
        },
        {
            value: "1340",
            key: "85"
        },
        {
            value: "1099",
            key: "A"
        },
        {
            value: "1342",
            key: "AEROBUS"
        },
        {
            value: "1100",
            key: "B"
        },
        {
            value: "1639",
            key: "B20"
        },
        {
            value: "1343",
            key:"B30"
        },
        {
            value: "1361",
            key: "B50"
        },
        {
            value: "1297",
            key: "B60"
        },
        {
            value: "1298",
            key: "B61"
        },
        {
            value: "1344",
            key: "B70"
        },
        {
            value: "1345",
            key: "B80"
        },
        {
            value: "1101",
            key: "C"
        },
        {
            value: "1346",
            key: "ESCUELA"
        },
        {
            value: "1347",
            key: "ESPECIALES"
        }
    ]
    let result = []

    function save(item, json, status){
        item.result = json
        item.isOK = status
        result.push(item)


        if(result.length ===  list.length){
            console.log(result)
            console.log(JSON.stringify(result))
        }
    }

    for (let item of list) {
        let body = {
            codigoLineaGrupo: item.value
        }
        fetch('http://cordoba.cuandollega.net/index.aspx/RecuperarRecorrido', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
                credentials: "same-origin"
            }).then(res => res.json())
            .catch(error => save(item, error, false))
            .then(response => save(item, response, true));
    }

}
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
