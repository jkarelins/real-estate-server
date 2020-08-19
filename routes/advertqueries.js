const { or, Op } = require("sequelize");
const User = require("../models/user");
const Image = require("../models/image/image");
const AdvertImage = require("../models/image/advert_image");

function generateQuery(
  priceFrom,
  priceTo,
  forRent,
  forSale,
  city,
  limit,
  offset
) {
  if (forSale && forRent) {
    return {
      where: {
        city: {
          [Op.iLike]: `%${city}%`
        },
        price: {
          [Op.and]: [{ [Op.gt]: +priceFrom }, { [Op.lt]: +priceTo }]
        }
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "isAdmin"]
          }
        },
        {
          model: AdvertImage,
          limit: 1,
          include: [Image]
        }
      ],
    };
  } else if (forRent) {
    return {
      where: {
        city: {
          [Op.iLike]: `%${city}%`
        },
        price: {
          [Op.and]: [{ [Op.gt]: +priceFrom }, { [Op.lt]: +priceTo }]
        },
        isForRent: true
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "isAdmin"]
          }
        },
        {
          model: AdvertImage,
          limit: 1,
          include: [Image]
        }
      ],
    };
  } else if (forSale) {
    return {
      where: {
        city: {
          [Op.iLike]: `%${city}%`
        },
        price: {
          [Op.and]: [{ [Op.gt]: +priceFrom }, { [Op.lt]: +priceTo }]
        },
        isForSale: true
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "isAdmin"]
          }
        },
        {
          model: AdvertImage,
          limit: 1,
          include: [Image]
        }
      ],
    };
  } else {
    return {
      where: {
        city: {
          [Op.iLike]: `%${city}%`
        },
        price: {
          [Op.and]: [{ [Op.gt]: +priceFrom }, { [Op.lt]: +priceTo }]
        }
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "isAdmin"]
          }
        },
        {
          model: AdvertImage,
          limit: 1,
          include: [Image]
        }
      ],
    };
  }
}

function generateQueryForAllCities(
  priceFrom,
  priceTo,
  forRent,
  forSale,
  limit,
  offset
) {
  if (forSale && forRent) {
    return {
      where: {
        price: {
          [Op.and]: [{ [Op.gt]: +priceFrom }, { [Op.lt]: +priceTo }]
        }
      },
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "isAdmin"]
          }
        },
        {
          model: AdvertImage,
          limit: 1,
          include: [Image]
        }
      ],
      order: [
        ['createdAt', 'DESC'],
      ],
    };
  } else if (forRent) {
    return {
      where: {
        price: {
          [Op.and]: [{ [Op.gt]: +priceFrom }, { [Op.lt]: +priceTo }]
        },
        isForRent: true
      },
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "isAdmin"]
          }
        },
        {
          model: AdvertImage,
          limit: 1,
          include: [Image]
        }
      ],
      order: [
        ['createdAt', 'DESC'],
      ],
    };
  } else if (forSale) {
    return {
      where: {
        price: {
          [Op.and]: [{ [Op.gt]: +priceFrom }, { [Op.lt]: +priceTo }]
        },
        isForSale: true
      },
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "isAdmin"]
          }
        },
        {
          model: AdvertImage,
          limit: 1,
          include: [Image]
        }
      ],
      order: [
        ['createdAt', 'DESC'],
      ],
    };
  }
}

module.exports = { generateQuery, generateQueryForAllCities };
