const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
// find all categories 
router.get('/', (req, res) => {
  Category.findAll({
    include: [
      {
        model: Product,
        attribute: ['id', 'product-name', 'price', 'stock', 'category_id']
      }
    ]
  })
    .then(categories => res.json(categories))
    .catch(err => {
      consoleerror(err);
      res.status(500).json(err);
    });
});

// find one category by its `id` value
router.get('/:id', (req, res) => {
  Category.findByPk(req.params.id, {
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }
    ]
  })
    .then(category => res.json(category))
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

// Create a new category 
router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name
  })
    .then(category => res.status(201).json(category))
    .catch(err => {
      console.error(err);
      res.status(400).json(err);
    });
});

// update a category by its `id` value
router.put('/:id', (req, res) => {
  Category.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(category => res.json(category))
    .catch(err => {
      console.error(err);
      res.status(400).json(err);
    });

});

// delete a category by its `id` value
router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(category => res.json(category))
    .catch(err => {
      console.error(err);
      res.status(400).json(err);
    });
});

module.exports = router;
