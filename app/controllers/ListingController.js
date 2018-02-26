const HostsController = require('../controllers/hostController').HostsController
const HostController = new HostsController()
const mysql = require('mysql')
let db = require('../models')
let Hosts = db.hosts

class ListingController {
    async index() {
        return await HostController.findAll()
    }

    async paginate(page, params) {
        let data = await HostController.findAndCount()
        let limit = params.limit
        let pages = Math.ceil(data.count / limit)
        params.offset = limit * (page - 1)

        let hosts = await HostController.findAll(params)

        return [hosts, pages]
    }

    async locate(lat, lng, limit) {
        let located = await db.sequelize.query('SELECT id, first_name, X(location) AS \'latitude\', Y(location) AS \'longitude\',(GLength(LineStringFromWKB(LineString(location,GeomFromText(\'POINT('+lat +' ' +lat+')\'))))) AS distance FROM hosts ORDER BY distance ASC LIMIT ' + limit + ';').then(data => {
            console.log(data)
        })

        return located

        // var lat = parseFloat("-37.1196");
        // var lng = parseFloat("42.6733");
        // var attributes = Object.keys(Hosts.attributes);
        // var location = sequelize.literal(`GeomFromText('POINT(${lng} ${lat})')`);
        // var distance = sequelize.fn('ST_Distance_Sphere', sequelize.col('location'), location);
        // attributes.push([distance,'distance']);

        // let located = await Hosts.findAll({
        // attributes: attributes,
        // order: distance,
        // where: sequelize.where(distance, {$lte: 5000}),
        // logging: console.log
        // }).catch((err) => {
        //     console.log(err)
        // })

        // return located
    }
}

module.exports = {ListingController}