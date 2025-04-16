import { StatusCodes } from "http-status-codes";
import { createErrorResponse } from "../../lib/services/error.js";
import { APIResponse } from "../../lib/services/response.js";
import { prisma } from "../../lib/services/prisma.js";

export const createAddress = async (req, res) => {
  try {
    const { userId, street, city, state, country, postalCode } = req.body;
    const address = await prisma.address.create({
      data: {
        userId,
        street,
        city,
        state,
        country,
        postalCode,
      },
    });
    return res
      .status(StatusCodes.CREATED)
      .send(APIResponse.success("Address created successfully", address));
  } catch (error) {
    return createErrorResponse(res, error);
  }
};

export const getAddress = async (req, res) => {
  try {
    const { userId } = req.query;
    const addresses = await prisma.address.findMany({
      where: { userId },
    });
    return res
      .status(StatusCodes.OK)
      .send(APIResponse.success("Addresses fetched successfully", addresses));
  } catch (error) {
    return createErrorResponse(res, error);
  }
};

export const getAddressById = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) {
      return createErrorResponse(
        res,
        "Address not found",
        StatusCodes.NOT_FOUND
      );
    }
    return res
      .status(StatusCodes.OK)
      .send(APIResponse.success("Address fetched successfully", address));
  } catch (error) {
    return createErrorResponse(res, error);
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const { street, city, state, country, postalCode } = req.body;
    const address = await prisma.address.update({
      where: { id: addressId, userId },
      data: {
        street,
        city,
        state,
        country,
        postalCode,
      },
    });
    return res
      .status(StatusCodes.OK)
      .send(APIResponse.success("Address updated successfully", address));
  } catch (error) {
    return createErrorResponse(res, error);
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    await prisma.address.delete({
      where: { id: addressId, userId },
    });
    return res
      .status(StatusCodes.OK)
      .send(APIResponse.success("Address deleted successfully"));
  } catch (error) {
    return createErrorResponse(res, error);
  }
};