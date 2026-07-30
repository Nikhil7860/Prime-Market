export async function POST(request: Request) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7); // Removes "Bearer "

    console.log("JWT:", token);

    // Verify the token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    return Response.json({ success: true });
}