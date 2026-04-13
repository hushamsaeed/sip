import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    avatarColor?: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatarColor: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    avatarColor?: string;
  }
}
