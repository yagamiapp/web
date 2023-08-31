import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { StatusCodes } from "$lib/StatusCodes";

export const load: LayoutServerLoad = async ({ locals }) => {
    if (!locals.perms?.edit) {
        throw error(StatusCodes.UNAUTHORIZED, 'You do not have permission to access this page.');
    }
}