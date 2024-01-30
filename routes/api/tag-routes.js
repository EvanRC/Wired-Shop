const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
// find all tags
router.get('/', (req, res) => {
  Tag.findAll({
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }
    ]
  })
    .then(tags => res.json(tags))
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

// find a single tag by its `id`
router.get('/:id', (req, res) => {
  Tag.findByPk(req.params.id, {
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }
    ]
  })
    .then(tag => res.json(tag))
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

// create a new tag
router.post('/', (req, res) => {
  Tag.create({
    tag_name: req.body.tag_name
  })
    .then((tag) => res.status(201).json(tag))
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
});

// update a tag's name by its `id` value
router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then((tag) => {
      if (tag[0]) {
        res.status(200).json({ message: 'Tag updated successfully.' });
      } else {
        res.status(404).json({ message: 'No tag was found with this id.' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
});

// Delete a tag by its id
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((tag) => {
      if (tag) {
        res.status(200).json({ message: 'Tag deleted successfully!' });
      } else {
        res.status(404).json({ message: 'No tag was found with this id.' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

module.exports = router;
