from mogo import Model, Field
from datetime import datetime
from bson import ObjectId


class AppModel(Model):
    created_at = Field()
    updated_at = Field()

    def marshal_fields(self):
        raise NotImplementedError

    @classmethod
    def create(cls, **kwargs):
        ts = datetime.now()
        kwargs['created_at'] = kwargs['updated_at'] = ts
        return super().create(**kwargs)

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now()
        return super().save(*args, **kwargs)

    def get_id(self):
        return str(self['_id'])

    @classmethod
    def load_by_id(cls, oid):
        if type(oid) != ObjectId:
            oid = ObjectId(oid)

        return cls.find_one(oid)
