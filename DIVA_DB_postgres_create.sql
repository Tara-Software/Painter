CREATE TABLE "brands" (
	"brand_id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "brands_pk" PRIMARY KEY ("brand_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "clothes" (
	"clothes_id" serial NOT NULL,
	"brand_id" integer NOT NULL,
	"gender_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"price" FLOAT NOT NULL,
	"size" TEXT NOT NULL,
	"link" TEXT NOT NULL,
	"stock" TEXT,
	"store_reference" TEXT NOT NULL UNIQUE,
	"created_at" TEXT NOT NULL DEFAULT 'now()',
	CONSTRAINT "clothes_pk" PRIMARY KEY ("clothes_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "categories" (
	"category_id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "categories_pk" PRIMARY KEY ("category_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "genders" (
	"gender_id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "genders_pk" PRIMARY KEY ("gender_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "images" (
	"image_id" serial NOT NULL,
	"clothes_id" integer NOT NULL,
	"url" TEXT NOT NULL,
	"title" TEXT NOT NULL,
	CONSTRAINT "images_pk" PRIMARY KEY ("image_id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "clothes" ADD CONSTRAINT "clothes_fk0" FOREIGN KEY ("brand_id") REFERENCES "brands"("brand_id");
ALTER TABLE "clothes" ADD CONSTRAINT "clothes_fk1" FOREIGN KEY ("gender_id") REFERENCES "genders"("gender_id");
ALTER TABLE "clothes" ADD CONSTRAINT "clothes_fk2" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id");
ALTER TABLE "images" ADD CONSTRAINT "images_fk0" FOREIGN KEY ("clothes_id") REFERENCES "clothes"("clothes_id");
