-- Activar RLS en todas las tablas públicas: la API accede como `postgres`,
-- que tiene BYPASSRLS, por lo que el comportamiento de Prisma no cambia.
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tickets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "history_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "counters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Quitar acceso de los roles de la API REST de Supabase (no se usa PostgREST).
REVOKE ALL ON TABLE "users" FROM anon, authenticated;
REVOKE ALL ON TABLE "categories" FROM anon, authenticated;
REVOKE ALL ON TABLE "tickets" FROM anon, authenticated;
REVOKE ALL ON TABLE "comments" FROM anon, authenticated;
REVOKE ALL ON TABLE "history_entries" FROM anon, authenticated;
REVOKE ALL ON TABLE "counters" FROM anon, authenticated;
REVOKE ALL ON TABLE "_prisma_migrations" FROM anon, authenticated;

-- Índices para claves foráneas que no los tenían.
CREATE INDEX "comments_authorId_idx" ON "comments"("authorId");
CREATE INDEX "history_entries_actorId_idx" ON "history_entries"("actorId");
