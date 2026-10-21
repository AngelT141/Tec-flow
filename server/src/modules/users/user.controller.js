import * as userService from './user.service.js';

export async function list(req, res, next) {
  try {
    const result = await userService.listUsers(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function toggle(req, res, next) {
  try {
    const user = await userService.toggleUser(req.user, req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
