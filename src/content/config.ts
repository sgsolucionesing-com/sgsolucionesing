
  import { z, defineCollection } from 'astro:content';

  const proyectos = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      slug: z.string().optional(), // opcional; si no, se toma del nombre del archivo
      sector: z.enum(['Minería','Cementero','Industrial','Energía','Oil & Gas','Otros']).default('Industrial'),
      cliente: z.string().optional(),
      ubicacion: z.string().optional(),
      fecha: z.string().optional(),
      coverImage: z.string(),
      resumen: z.string().max(240),
      kpis: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      tecnologias: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      destacado: z.boolean().default(false),
      order: z.number().optional(),
      gallery: z.array(z.string()).default([])
    })
  });

  export const collections = { proyectos };
