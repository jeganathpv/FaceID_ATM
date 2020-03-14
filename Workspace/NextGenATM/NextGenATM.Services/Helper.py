

class DataMassager:
    @staticmethod
    def massageDataDocument(object):
        del object['_id']
        return object            
