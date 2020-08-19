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
        ['createdAt', 'ASC'],
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
        ['createdAt', 'ASC'],
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
        ['createdAt', 'ASC'],
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
        ['createdAt', 'ASC'],
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
        ['createdAt', 'ASC'],
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
        ['createdAt', 'ASC'],
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
        ['createdAt', 'ASC'],
      ],
    };
  }
}

module.exports = { generateQuery, generateQueryForAllCities };
