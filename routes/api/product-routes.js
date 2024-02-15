const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  Product.findAll({
    include: [
      {
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        attributes: ['id', 'tag_name']
      }
    ]
  })
  .then(products => res.json(products))
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  });
});

// get one product by id
router.get('/:id', (req, res) => {
  Product.findByPk(req.params.id, {
    include: [
      {
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        attributes: ['id', 'tag_name']
      }
    ]
  })
  .then(product => res.json(product))
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  });
});

router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // Check if tagIds is provided and is an array
      if (Array.isArray(req.body.tagIds) && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // If no product tags, just respond with the product
      res.status(201).json(product);
    })
    .then((productTagIds) => {
      // If there was product tags, productTagIds will be an array
      if (productTagIds) {
        res.status(201).json(productTagIds);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productId = req.params.id;

  const deleted = await Product.destroy({
    where: {
      id:productId
    }
  });

  if (deleted) {
    // If the delte operation is succesful, sends a 200 response
    res.status(200).json({ message: 'Product succefully deleted' });
  } else {
    // If the product could not be found or deleted, sends a 404 response
    res.status(404).json({ message: 'Product was not found' });
  }
  } catch (error) {
    // If an error occurs, send a 500 message
    console.error('Error deleting product:' , error);
    res.status(500).json({ message: 'There was an error deleting the product' });
  }
});

module.exports = router;
